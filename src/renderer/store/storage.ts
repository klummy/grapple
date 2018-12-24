import Store from 'electron-store';

import logger from '../libs/logger';

export const createStorage = () => {
  const storageOpts = {}

  const store = new Store(storageOpts)

  return {
    getItem: (key: string) => {
      logger.info(`Retrieving item with key: ${key}: `)
      return new Promise((resolve) => {
        resolve(store.get(key))
      })
    },

    removeItem: (key: string): Promise<void> => {
      logger.info(`Deleting item with key: ${key}: `)

      return new Promise((resolve) => {
        resolve(store.delete(key))
      })
    },

    // tslint:disable-next-line:no-any
    setItem: (key: string, item: any): Promise<void> => {
      logger.info(`Setting item with key: ${key}: `, item)
      return new Promise((resolve) => {
        resolve(store.set(key, item))
      })
    },

  }
}

const storage = createStorage()

export default storage;