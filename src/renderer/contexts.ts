/* eslint-disable @typescript-eslint/no-unused-vars, sort-keys */
import React from 'react';

import { ILayout, INotification } from './types/layout';
import { IReduxAction } from './types';
import { IProject } from './types/projects';

export interface IGenericContext<T> {
  dispatch: React.Dispatch<IReduxAction>
  state: T
}

export const defaultLayoutState: ILayout = {
  activeTab: '',
  notifications: [],
  tabs: [],
};


export interface ILayoutContext {
  dispatch: React.Dispatch<IReduxAction>
  state: ILayout
  notify: (item: INotification) => void
}


export const LayoutContext = React.createContext<ILayoutContext>({
  dispatch: () => { },
  notify: () => { },
  state: defaultLayoutState,
});

export const defaultProjectState: IProject = {
  config: {},
  filteredProtos: [],
  name: '',
  protos: [],
  searchTerm: '',
};


export const ProjectContext = React.createContext<IGenericContext<IProject>>({
  dispatch: () => { },
  state: defaultProjectState,
});
