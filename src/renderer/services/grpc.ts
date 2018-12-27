import fs from 'fs';
import protobufjs, { Enum } from 'protobufjs';

import logger from '../libs/logger';
import { grpcTypes } from "./grpc-constants";

export interface ICustomFields {
  // tslint:disable-next-line:no-any
  defaultValue: any
  fullName: string
  id: number
  name: string
  nested?: Array<ICustomFields>
  type: string
  values?: Enum["valuesById"]
}

const lookupField = (root: protobufjs.Root, type: string): {
  nested?: Array<ICustomFields>,
  type: string
  values?: Enum["valuesById"]
} => {
  // Handle for basic types

  const fieldType = grpcTypes[type]
  if (fieldType) {
    return {
      type: fieldType
    }
  }

  try {
    const nestedType = root.lookupType(type)

    const f = nestedType.fields
    const nested = Object.keys(f).map(key => {
      const fValue = f[key]

      const {
        nested: nestedF,
        type: typeF
      } = lookupField(root, fValue.type)

      return {
        defaultValue: fValue.defaultValue,
        fullName: fValue.fullName,
        id: fValue.id,
        name: fValue.name,
        nested: nestedF,
        type: typeF,
      }
    })

    return {
      nested,
      type
    }

  } catch (error) {
    logger.warn('Error looking up type, attempting enum lookup', type, error)
  }

  try {
    let enumVal = root.lookupEnum(type)
    enumVal = (enumVal as Enum)

    return {
      type: grpcTypes.enum,
      values: enumVal.valuesById,
    }
  } catch (error) {
    logger.warn(`Enum lookup failed for type - ${type} - `, error)
  }

  // TODO: Handle imported files here

  return {
    type
  }
}

// tslint:disable-next-line:no-any
export const getFields = (root: protobufjs.Root, method: any): Array<ICustomFields> => {
  const requestFields = root.lookupTypeOrEnum((method).requestType).fields

  const fields = Object.keys(requestFields).map(key => {
    const field = requestFields[key]

    const { nested, type, values } = lookupField(root, field.type)

    return {
      defaultValue: field.defaultValue,
      fullName: field.fullName,
      id: field.id,
      name: field.name,
      nested,
      type,
      values
    }
  })

  return fields
}


export const loadFields = (protoPath: string, serviceName: string): Promise<{
  fields: Array<ICustomFields>
}> => {
  return new Promise((resolve, reject) => {
    fs.readFile(protoPath, 'utf8', (err, data) => {
      if (err) {
        logger.error("Error reading proto file contents")
        reject(err)
      }

      const { root, } = protobufjs.parse(data)

      const method = root.lookup(
        serviceName.substring(1, serviceName.length).replace('/', '.'))

      if (!method) {
        logger.error('Method not found in proto definition')
        reject(Error('Method not found in proto definition'))
      }

      const fields = getFields(root, method)

      resolve({
        fields,
      })
    })

  });
}