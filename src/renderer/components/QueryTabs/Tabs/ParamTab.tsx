import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import QueryParamBuilder from '../../QueryParamBuilder/QueryParamBuilder';
import { ICustomFields, loadFields } from '../../../services/grpc';
import { IQueryTabItemProps, QueryTabItemWrapper } from './shared';
import { IStoreState } from '../../../types';
import { notificationTypes, ITab, INotification } from '../../../types/layout';
import logger from '../../../libs/logger';
import * as layoutActions from '../../../store/layout/layout.actions';

import cuid = require('cuid');

// requestFields?: ICustomFields[];

/**
* Load the data for a specified tab
*/
const loadFieldsForTab = (tab: ITab): Promise<ICustomFields[]> => {
  return new Promise((resolve, reject) => {
    const { proto, service = { originalName: '' } } = tab;

    if (!proto) {
      reject(new Error('Proto missing in tab definition'));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadFields(proto.path, (service as any).path)
      .then(fields => resolve(fields))
      .catch((err) => {
        logger.error('Error loading fields for proto', err);
        reject(Error);
      });
  });
};

interface IParamTab extends IQueryTabItemProps {
  activeTab: string,
  currentTab: ITab,
  notify: (item: INotification) => void
}

const ParamTab: React.SFC<IParamTab> = ({
  activeTab, currentTab, notify, visible,
}) => {
  const [requestFields, setRequestFields] = useState<ICustomFields[] | undefined>(undefined);

  // Load the fields for the request on first load and when the active tab changes
  useEffect(() => {
    if (activeTab && currentTab) {
      loadFieldsForTab(currentTab)
        .then(fields => setRequestFields(fields))
        .catch((err) => {
          notify({
            id: cuid(),
            message: 'Unable to load the fields for this tab. This probably shouldn\'t happen, please use the report link below to report this error',
            rawErr: err,
            title: 'Loading error',
            type: notificationTypes.error,
          });
          return undefined;
        });
    }
  }, [activeTab]);

  return (
    <QueryTabItemWrapper visible={visible}>
      {requestFields && <QueryParamBuilder fields={requestFields} />}
    </QueryTabItemWrapper>

  );
};

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  currentTab:
    state.layout.tabs.find(tab => tab.id === state.layout.activeTab) || {},
});

const mapDispatchToProps = {
  notify: (item: INotification) => layoutActions.addNotification(item),
  updateTab: (tab: ITab) => layoutActions.updateTab(tab),
};

export default connect(mapStateToProps, mapDispatchToProps)(ParamTab);
