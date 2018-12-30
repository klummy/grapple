import { IProto } from '../types/protos';

export const capitalizaFirstLetter = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1, str.length)}`

/**
 * Validate a proto file
 */
export const validateProto = (proto: IProto) => {
  return new Promise((resolve, reject) => {
    resolve(true)
  });
}