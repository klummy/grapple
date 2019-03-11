/* eslint-disable prefer-promise-reject-errors */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import fs from 'fs';
import lodashGet from 'lodash.get';
import { ServiceClientConstructor, ServiceClient } from '@grpc/grpc-js/build/src/make-client';

import protobufjs, { Enum } from 'protobufjs';

import logger from '../libs/logger';
import { grpcTypes } from './grpc-constants';
import { IProto } from '../types/protos';

export interface ICustomFields {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue: any;
  fullName: string;
  id: number;
  name: string;
  nested?: ICustomFields[];
  type: string;
  values?: Enum['valuesById'];
}

const lookupField = (
  root: protobufjs.Root,
  type: string,
): {
  nested?: ICustomFields[];
  repeated?: boolean,
  type: string;
  values?: Enum['valuesById'];
} => {
  // Handle for basic types
  const fieldType = grpcTypes[type];
  if (fieldType) {
    return {
      type: fieldType,
    };
  }

  // Handle for nested types
  try {
    const nestedType = root.lookupType(type);

    const f = nestedType.fields;
    const nested = Object.keys(f).map((key) => {
      const fValue = f[key];

      const { nested: nestedF, repeated, type: typeF } = lookupField(root, fValue.type);

      return {
        defaultValue: fValue.defaultValue,
        fullName: fValue.fullName,
        id: fValue.id,
        name: fValue.name,
        nested: nestedF,
        repeated,
        type: typeF,
      };
    });

    return {
      nested,
      type,
    };
  } catch (error) {
    logger.warn('Error looking up type, attempting enum lookup', type, error);
  }

  // Handle enums
  try {
    let enumVal = root.lookupEnum(type);
    enumVal = enumVal as Enum;

    return {
      type: grpcTypes.enum,
      values: enumVal.valuesById,
    };
  } catch (error) {
    logger.warn(`Enum lookup failed for type - ${type} - `, error);
  }

  return {
    type,
  };
};

export const getFields = (
  root: protobufjs.Root,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  method: any,
): ICustomFields[] => {
  const requestFields = root.lookupTypeOrEnum(method.requestType).fields;

  const fields = Object.keys(requestFields).map((key) => {
    const field = requestFields[key];

    const {
      nested, type, values,
    } = lookupField(root, field.type);

    return {
      defaultValue: field.defaultValue,
      fullName: field.fullName,
      id: field.id,
      name: field.name,
      nested,
      repeated: field.repeated,
      type,
      values,
    };
  });

  return fields;
};

/**
 * Get the client instance for a given service
 * @returns {Promise<ServiceClient>} The Service Client
 */
export const getClientInstance = async (params: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  credentials?: any, // TODO: Add the right type
  proto: IProto,
  service: protoLoader.MethodDefinition<{}, {}>,
  serviceAddress: string
}): Promise<{
  client: ServiceClient,
  methodName: string
}> => {
  const {
    credentials,
    proto,
    service,
    serviceAddress,
  } = params;

  const creds = credentials || grpc.credentials.createInsecure();

  return new Promise(async (resolve, reject) => {
    if (!serviceAddress.trim()) {
      reject({
        message: 'The service address is a required field',
        title: 'Validation error',
      });
    }

    const pkgDef = await protoLoader.load(proto.path, {
      defaults: true,
      enums: String,
      keepCase: true,
      longs: String,
      oneofs: true,
    }).catch((err) => {
      reject(err);
      return null;
    });

    if (!pkgDef) return;

    const pkgObject = grpc.loadPackageDefinition(pkgDef);

    // Extract the service lookup path from the service path
    const [serviceLookupPath, methodName] = service.path
      .substring(1, service.path.length) // Replace initial slash
      .split('/'); // Split with '/' to get the service itself (it comes first)

    const Client = lodashGet(pkgObject, serviceLookupPath) as ServiceClientConstructor;

    if (!Client) {
      logger.error('Fatal error creating client', {
        client: Client,
        params,
        pkgObject,
        serviceLookupPath,
      });
      reject(new Error('Error parsing proto'));
      return;
    }

    resolve({
      client: new Client(serviceAddress, creds),
      methodName,
    });
  });
};

/**
 * Load the fields for a given proto path and specified service
 * @param {string} protoPath Path to proto file on filesystem
 * @param {string} serviceName Name of service to lookup
 * @returns
 */
export const loadFields = (
  protoPath: string,
  serviceName: string,
): Promise<ICustomFields[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(protoPath, 'utf8', (err, data) => {
      if (err) {
        logger.error('Error reading proto file contents');
        reject(err);
      }

      const parsed = protobufjs.parse(data);

      let { root } = parsed;
      const { imports } = parsed;

      if (imports && imports.length > 0) {
        // Load all imports
        imports.forEach((importItem) => {
          root = root.loadSync(importItem, { keepCase: true });
        });
      }

      const method = root.lookup(
        serviceName.substring(1, serviceName.length).replace('/', '.'),
      );

      if (!method) {
        logger.error('Method not found in proto definition');
        reject(Error('Method not found in proto definition'));
      }

      const fields = getFields(root, method);

      resolve(fields);
    });
  });
};
