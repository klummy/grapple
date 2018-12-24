import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import config from 'common/config';
import Layout from './components/Layout';
import Main from './components/Main';
import logger from './libs/logger';
import store from './store';
import storage from './store/storage';
import './styles/global.css';
import './styles/normalize.css';
import { IStoreState } from './types';

class App extends React.Component<{}, {}> {
  componentDidMount() {

    storage.getItem(config.storage.main)
      .then((item) => {
        if (item) {
          logger.info('Rehydrating store from user preferences')
          const payload = (item as IStoreState)

          store.dispatch({
            payload,
            type: 'REHYDRATE_STORE',
          })
        } else {
          logger.info('No existing user store found');
        }
      })
      .catch(err => {
        logger.error('Error loading persisted store - ', err)
      })
  }

  render() {
    return (
      <Provider store={ store }>
        <Layout>
          <Main />
        </Layout>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'))