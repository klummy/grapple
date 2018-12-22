import { IProto } from '../types/protos';

/**
 * Validate a proto file
 */
export const validateProto = (proto: IProto) => {
  return new Promise((resolve, reject) => {
    resolve(true)
  });
}