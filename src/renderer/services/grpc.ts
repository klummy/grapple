/* eslint-disable prefer-promise-reject-errors */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import fs from 'fs';

import protobufjs, { Enum } from 'protobufjs';

import logger from '../libs/logger';
import { ITab, ITabMeta, ITabStatus } from '../types/layout';
import { grpcTypes } from './grpc-constants';

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

export const dispatchRequest = (params: {
  tab: ITab,
  serviceAddress: string,
  metadata: object,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
}): Promise<{
  response: object | Error,
  meta: ITabMeta
}> => {
  const {
    tab,
    serviceAddress,
    metadata,
    payload,
  } = params;

  return new Promise((resolve, reject) => {
    const { service, proto } = tab;

    const address = serviceAddress.replace(/^https?:\/\//i, '');

    if (!service || !proto) {
      reject(new Error(`Tab doesn't contain crucial data ${JSON.stringify(tab)}`));
      return;
    }

    protoLoader
      .load(proto.path, {
        defaults: true,
        enums: String,
        keepCase: true,
        longs: String,
        oneofs: true,
      })
      .then((pkgDef) => {
        const pkgObject = grpc.loadPackageDefinition(pkgDef);


        // TODO: Refactor as to not depend on key matching; Or at least account for multiple keys
        const serviceIndex = Object.keys(pkgObject)[0];
        const servicePath = (service.path.match(/\.[^.]*$/) || [''])[0].replace(
          '.',
          '',
        );
        const [serviceName, serviceMethodFull] = servicePath.split('/');
        const serviceMethod = serviceMethodFull.charAt(0).toLowerCase()
          + serviceMethodFull.slice(1);

        // TODO: Allow for secured credentials with credentials passed by user
        const credentials = grpc.credentials.createInsecure();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serviceProto = pkgObject[serviceIndex] as any;
        const client = new serviceProto[serviceName](
          address,
          credentials,
        );

        /**
         * Close the client after a successful/failed request
         * NOTE: This will need to be revisted after streaming is implemented
         */
        const cleanupClient = () => {
          logger.info('Closing client connection');
          client.close();
        };

        // TODO: Consider better handling for connections that don't happen quickly.
        // See: https://github.com/grpc/grpc/issues/10569
        const connected = client.getChannel().getConnectivityState();

        if (connected !== 2) {
          cleanupClient();

          reject({
            response: new Error(`Error connecting to server at "${serviceAddress}"`),
          });
          return;
        }

        const started = performance.now();
        let ended;

        const reqMetadata = new grpc.Metadata();
        Object.keys(metadata).forEach((key) => {
          reqMetadata.set(key, metadata[key]);
        });

        try {
          client[serviceMethod](payload, reqMetadata, (err: Error, response: object) => {
            if (err) {
              ended = performance.now();

              logger.warn('gRPC request failed with error ', err);
              cleanupClient();
              reject({
                meta: {
                  status: ITabStatus.error,
                  timestamp: ended - started,
                },
                response: err,
              });
            } else {
              ended = performance.now();
              logger.info('gRPC request successful', response);
              cleanupClient();
              resolve({
                meta: {
                  status: ITabStatus.success,
                  timestamp: ended - started,
                },
                response,
              });
            }
          });
        } catch (error) {
          ended = performance.now();
          reject({
            meta: {
              status: ITabStatus.error,
              timestamp: ended - started,
            },
            response: error,
          });
        }
      })
      .catch((err) => {
        reject({
          meta: {
            status: ITabStatus.error,
            timestamp: 0,
          },
          response: err,
        });
      });
  });
};
