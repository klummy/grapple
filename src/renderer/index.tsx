import * as grpc from '@grpc/grpc-js';
import React, { useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import omit from 'lodash.omit';
import config from '../common/config';
import Layout from './components/Layout';
import Content from './components/Content';

import logger from './libs/logger';
import { registerGlobalShortcuts } from './services/shortcuts';
import storage from './store/storage';
import {
  defaultLayoutState,
  defaultProjectState,
  LayoutContext,
  ProjectContext,
} from './contexts';
import layoutReducer from './store/layout/layout.reducer';
import projectReducer from './store/projects/projects.reducer';
import * as layoutActions from './store/layout/layout.actions';

import './styles/global.css';
import './styles/normalize.css';
import { IStoreState } from './types';
import { INotification } from './types/layout';

// Set the gRPC logger to use custom logger
grpc.setLogger(logger);

const App: React.SFC<{}> = () => {
  // Setup state items
  // - Layout
  const [layoutState, setLayoutState] = useReducer(layoutReducer, defaultLayoutState);
  // - Projects
  const [projectState, setProjectState] = useReducer(projectReducer, defaultProjectState);

  // Rehydrate previous user config data if it exists
  useEffect(() => {
    storage
      .getItem(config.storage.main)
      .then((item) => {
        if (item) {
          // logger.info('Rehydrating store from user preferences');
          const payload = item as IStoreState;

          setLayoutState({
            payload: payload.layout,
            type: 'REHYDRATE',
          });

          setProjectState({
            payload: payload.projects,
            type: 'REHYDRATE',
          });
        } else {
          logger.info('No existing user store found');
        }
      })
      .catch((err) => {
        logger.error('Error loading persisted store - ', err);
      });

    // Attach application shortcuts
    registerGlobalShortcuts({
      layout: setLayoutState,
      project: setProjectState,
    });
  }, []);

  // Update the persisted data in the storage when the state data changes
  useEffect(() => {
    const payload: IStoreState = {
      layout: {
        ...layoutState,
        notifications: [],
        tabs: layoutState.tabs.map(tab => omit(tab, ['inProgress', 'meta', 'results'])),
      },
      projects: {
        ...projectState,
        filteredProtos: [],
        searchTerm: '',
      },
    };

    storage.setItem(config.storage.main, payload);
  }, [layoutState, projectState]);

  return (
    <LayoutContext.Provider value={{
      dispatch: setLayoutState,
      notify: (item: INotification) => setLayoutState(layoutActions.addNotification(item)),
      state: layoutState,
    }}
    >
      <ProjectContext.Provider value={{
        dispatch: setProjectState,
        state: projectState,
      }}
      >
        <Layout>
          <Content />
        </Layout>
      </ProjectContext.Provider>
    </LayoutContext.Provider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app'),
);
