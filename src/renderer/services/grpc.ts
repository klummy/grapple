import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import fs from 'fs';
import protobufjs, { Enum } from 'protobufjs';

import logger from '../libs/logger';
import { ITab } from '../types/layout';
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

  // Handle for nested types
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

  // Handle enums
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

      const parsed = protobufjs.parse(data)

      let { root } = parsed
      const { imports } = parsed

      if (imports && imports.length > 0) {
        // Load all imports
        imports.forEach((importItem) => {
          root = root.loadSync(importItem, { keepCase: true })
        })
      }

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

// tslint:disable-next-line:no-any
export const dispatchRequest = (tab: ITab, serviceAddress: string, payload: any): Promise<any> => {

  return new Promise((resolve, reject) => {
    const { service, proto } = tab

    if (!service || !proto) {
      reject(Error(`Tab doesn't contain crucial data ${JSON.stringify(tab)}`))
      return
    }

    protoLoader.load(proto.path, {
      defaults: true,
      enums: String,
      keepCase: true,
      longs: String,
      oneofs: true
    })
      .then(pkgDef => {
        const pkgObject = grpc.loadPackageDefinition(pkgDef)

        const serviceIndex = Object.keys(pkgObject)[0]
        const serviceName = Object.keys(pkgObject[serviceIndex])[0]
        const servicePath = (service.path.match(/\.[^.]*$/) || [''])[0].replace('.', '')
        const serviceMethod = servicePath.split('/')[1]

        const credentials = grpc.credentials.createInsecure()
        const options = {
          'grpc.keepalive_time_ms': 15000,
          'grpc.max_reconnect_backoff_ms': 1000,
          'grpc.min_reconnect_backoff_ms': 1000,
        };

        const client = new pkgObject[serviceIndex][serviceName]('0.0.0.0:9284', credentials, options)

        console.log('serviceAddress => ', serviceAddress);

        logger.info('Waiting for client connection to be ready')
        client.waitForReady(50000, (err: Error) => {
          if (err) {
            logger.error('Error connecting to address', serviceAddress, err)
            reject(err)
            return
          }

          logger.info('Connection to server')
          console.log('err => ', err);

          // tslint:disable-next-line no-any
          client[serviceMethod](payload, (error: Error, response: any) => {
            console.log('error => ', error);
            console.log('response => ', response);
          })

          logger.info('Closing client connection')
          client.close()
        })
      })


  });
}