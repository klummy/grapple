import * as grpc from '@grpc/grpc-js';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import config from '../common/config';
import Layout from './components/Layout';
import Content from './components/Content';

import logger from './libs/logger';
import { registerGlobalShortcuts } from './services/shortcuts';
import store from './store';
import storage from './store/storage';
import { IStoreState } from './types';

import './styles/global.css';
import './styles/normalize.css';

// Set the gRPC logger to use custom logger
grpc.setLogger(logger);

const App: React.SFC<{}> = () => {
  useEffect(() => {
    // Rehydrate previous user config data if it exists
    storage
      .getItem(config.storage.main)
      .then((item) => {
        if (item) {
          logger.info('Rehydrating store from user preferences');
          const payload = item as IStoreState;

          store.dispatch({
            payload,
            type: 'REHYDRATE_STORE',
          });
        } else {
          logger.info('No existing user store found');
        }
      })
      .catch((err) => {
        logger.error('Error loading persisted store - ', err);
      });

    // Attach application shortcuts
    registerGlobalShortcuts(store.dispatch);
  });

  return (
    <Provider store={store}>
      <Layout>
        <Content />
      </Layout>
    </Provider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app'),
);
