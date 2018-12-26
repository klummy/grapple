import fs from 'fs';
import protobufjs from 'protobufjs';

import logger from '../libs/logger';

export interface ILoadFields {
  requestFields: {
    [k: string]: protobufjs.Field
  }
}

export const loadFields = (protoPath: string, serviceName: string): Promise<ILoadFields> => {
  return new Promise((resolve, reject) => {
    fs.readFile(protoPath, 'utf8', (err, data) => {
      if (err) {
        logger.error("Error reading proto file contents")
        reject(err)
      }

      const { root } = protobufjs.parse(data)

      const method = root.lookup(
        serviceName.substring(1, serviceName.length).replace('/', '.'))

      if (!method) {
        logger.error('Method not found in proto definition')
        reject(Error('Method not found in proto definition'))
      }

      // tslint:disable-next-line:no-any
      const requestFields = root.lookupTypeOrEnum((method as any).requestType).fields

      resolve({
        requestFields,
      })
    })

  });
}