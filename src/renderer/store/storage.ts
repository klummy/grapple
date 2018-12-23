import Store from 'electron-store';

import logger from '../libs/logger';

export default () => {
  const storageOpts = {}

  const store = new Store(storageOpts)

  return {
    getItem: (key: string) => {
      logger.info('getItem => ', key)
      return new Promise((resolve) => {
        resolve(store.get(key))
      })
    },

    removeItem: (key: string): Promise<void> => {
      logger.info('removeItem => ', key)

      return new Promise((resolve) => {
        resolve(store.delete(key))
      })
    },

    // tslint:disable-next-line:no-any
    setItem: (key: string, item: any): Promise<void> => {
      logger.info('setItem => ', key, item)
      return new Promise((resolve) => {
        resolve(store.set(key, item))
      })
    },

  }
}