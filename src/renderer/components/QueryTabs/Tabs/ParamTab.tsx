import React, { useEffect, useState, useContext } from 'react';
import QueryParamBuilder from '../../QueryParamBuilder/QueryParamBuilder';
import { ICustomFields, loadFields } from '../../../services/grpc';
import { IQueryTabItemProps, QueryTabItemWrapper } from './shared';
import { notificationTypes, ITab } from '../../../types/layout';
import logger from '../../../libs/logger';
import { LayoutContext } from '../../../contexts';

import cuid = require('cuid');

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

const ParamTab: React.SFC<IQueryTabItemProps> = ({
  visible,
}) => {
  const {
    notify,
    state: {
      activeTab,
      tabs,
    },
  } = useContext(LayoutContext);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const [requestFields, setRequestFields] = useState<ICustomFields[] | undefined>(undefined);

  // Load the fields for the request on first load and when the active tab changes
  useEffect(() => {
    if (activeTab && currentTab) {
      loadFieldsForTab(currentTab)
        .then(fields => setRequestFields(fields))
        .catch((err) => {
          notify({
            id: cuid(),
            message: `Unable to load the fields for this tab.
            This probably shouldn't happen, please use the report link below to report this error`,
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
      {requestFields && (
        <QueryParamBuilder
          currentTab={currentTab}
          fields={requestFields}
        />
      )}
    </QueryTabItemWrapper>

  );
};

export default ParamTab;
