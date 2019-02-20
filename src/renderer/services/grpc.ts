import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import fs from 'fs';

import protobufjs, { Enum } from 'protobufjs';

import logger from '../libs/logger';
import { ITab } from '../types/layout';
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

      const { nested: nestedF, type: typeF } = lookupField(root, fValue.type);

      return {
        defaultValue: fValue.defaultValue,
        fullName: fValue.fullName,
        id: fValue.id,
        name: fValue.name,
        nested: nestedF,
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

    const { nested, type, values } = lookupField(root, field.type);

    return {
      defaultValue: field.defaultValue,
      fullName: field.fullName,
      id: field.id,
      name: field.name,
      nested,
      type,
      values,
    };
  });

  return fields;
};

export const loadFields = (
  protoPath: string,
  serviceName: string,
): Promise<{
  fields: ICustomFields[];
}> => {
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

      resolve({
        fields,
      });
    });
  });
};

export const dispatchRequest = (
  tab: ITab,
  rawServiceAddress: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
): Promise<object | Error> => {
  return new Promise((resolve, reject) => {
    const { service, proto } = tab;

    const serviceAddress = rawServiceAddress.replace(/^https?:\/\//i, '');

    if (!service || !proto) {
      reject(Error(`Tab doesn't contain crucial data ${JSON.stringify(tab)}`));
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
          serviceAddress,
          credentials,
        );

        /**
         * Close the client after a successful/failed request
         * NOTE: This may need to be revisted after streaming is implemented
         */
        const cleanupClient = () => {
          logger.info('Closing client connection');
          client.close();
        };

        try {
          client[serviceMethod](payload, (err: Error, response: object) => {
            if (err) {
              logger.warn('gRPC request failed with error ', err);
              cleanupClient();
              reject(err);
            } else {
              logger.info('gRPC request successful', response);
              cleanupClient();
              resolve(response);
            }
          });
        } catch (error) {
          reject(error);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
