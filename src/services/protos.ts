import * as protoLoader from '@grpc/proto-loader';

import { IProto } from '../types/protos';

/**
 * Validate a proto file
 */
export const validateProto = (proto: IProto) => {

  return new Promise((resolve, reject) => {
    const options = {}
    try {
      const pkgDef = protoLoader.loadSync(proto.path, options)
      resolve(pkgDef)
    } catch (error) {
      reject(error)
    }
  });
}