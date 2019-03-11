import * as grpc from '@grpc/grpc-js';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as layoutActions from '../../store/layout/layout.actions';
import { IStoreState } from '../../types';
import {
  ITab, INotification, notificationTypes, ITabStatus,
} from '../../types/layout';


import logger from '../../libs/logger';
import { getClientInstance } from '../../services/grpc';
import {
  attachIndividualShortcut,
  shortcutModifiers,
  unregisterShortcut,
} from '../../services/shortcuts';

import {
  Button,
  Form,
  Input,
} from '../GenericComponents';
import {
  QueryPaneContainer,
  ParamBuilderContainer,
} from './QueryPane.components';
import QueryTabs from '../QueryTabs';

import cuid = require('cuid');

const AddressBarContainer = styled(Form)`
  flex-shrink: 0;
`;

export interface IQueryPaneProps {
  activeTab: string;
  currentTab: ITab;
  notify: (item: INotification) => void
  tabs: ITab[];
  updateTab: (tab: ITab) => void;
}
export interface IQueryPaneState {
  serviceAddress: string
}

/**
 * Generate a payload from the form elements (generated from the proto defs)
 * @returns {object} Payload
 */
const generatePayload = (): object => {
  const queryContainer = document.getElementById('queryParams');
  if (!queryContainer) {
    return {};
  }

  const inputs = queryContainer.querySelectorAll('[data-query-item]');
  const payload = {};

  inputs.forEach((input) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputElement = input as any;

    const inputName = inputElement.name;
    const inputValue = inputElement.value;

    // If it's nested field, put each value under the parent; else assign the name to the value
    if (inputName.includes('/')) {
      const [parent, self] = inputName.split('/');

      // TODO: This won't work well for multiple nested levels.
      // Only the first level, revisit(will likely need a recursive function)
      payload[parent] = {
        ...payload[parent],
        [self]: inputValue,
      };
    } else {
      payload[inputName] = inputValue;
    }
  });

  return payload;
};

/**
 * Generate the metadata from the metadata form on the page
 * @returns {object} Payload
 */
const generateMetadata = (): object => {
  const metaContainer = document.getElementById('queryMeta');
  if (!metaContainer) {
    return {};
  }

  const metaTabRows = metaContainer.querySelectorAll('[data-meta-tab-row]');
  const metadata = {};

  metaTabRows.forEach((tabRow) => {
    const enabled = (tabRow.querySelector('[data-enabled]') as HTMLInputElement).checked;

    const key = (tabRow.querySelector('[data-key]') as HTMLInputElement).value;
    const { value } = tabRow.querySelector('[data-value]') as HTMLInputElement;

    if (enabled && key && value) {
      metadata[key] = value;
    }
  });

  return metadata;
};

const handleSaveTabData = (params: {
  currentTab: ITab,
  metadata?: object,
  notify: (item: INotification) => void,
  payload?: object,
  serviceAddress?: string,
  showNotification: boolean,
  updateTab: (tab: ITab) => void,
}) => {
  const {
    currentTab,
    metadata,
    notify,
    payload,
    serviceAddress: address,
    showNotification = true,
    updateTab,
  } = params;

  if (currentTab) {
    updateTab({
      ...currentTab,
      address,
      inProgress: !showNotification, // Prevent double action dispatched
      metadata: metadata || generateMetadata(),
      queryData: payload || generatePayload(),
    });


    if (showNotification) {
      notify({
        id: cuid(),
        message: 'Tab data saved successfully',
        title: 'Success',
        type: notificationTypes.success,
      });
    }
  }
};

/**
* Make the request
*/
const handleDispatchRequest = async (params: {
  currentTab: ITab,
  notify: (item: INotification) => void,
  serviceAddress: string,
  updateTab: (tab: ITab) => void
}) => {
  const {
    currentTab,
    notify,
    serviceAddress,
    updateTab,
  } = params;

  if (!serviceAddress) {
    notify({
      id: cuid(),
      message: 'Invalid/missing service address. Please provide a valid address.',
      title: 'Validation error',
      type: notificationTypes.warn,
    });
    return;
  }

  const payload = generatePayload();
  const metadata = generateMetadata();

  handleSaveTabData({
    currentTab,
    metadata,
    notify,
    payload,
    serviceAddress,
    showNotification: false,
    updateTab,
  });

  if (!currentTab.proto || !currentTab.service) {
    // No pro
    logger.error('Tab doesn\'t contain required proto or service', currentTab);
    return;
  }

  const { proto, service } = currentTab;

  // Get the client and the method name using the tab details
  const clientInstance = await getClientInstance({
    proto,
    service,
    serviceAddress,
  })
    .catch((err) => {
      logger.error('Error getting client instance ', err);

      notify({
        id: cuid(),
        message: err.message,
        rawErr: err,
        title: err.title || 'Error making request',
        type: notificationTypes.error,
      });
      return null;
    });

  if (!clientInstance) {
    return;
  }

  const { client, methodName } = clientInstance;

  // Create metadata
  const reqMetadata = new grpc.Metadata();
  Object.keys(metadata).forEach((key) => {
    reqMetadata.set(key, metadata[key]);
  });

  // Setup timers
  const reqStarted = performance.now();
  let reqEnded: number = 0;

  // Somewhat hacky way to check for transient failure.
  // client.waitForReady would likely be a better option but it wasn't working as expected.
  // Revisit this at a later date
  setTimeout(() => {
    if (reqEnded === 0) {
      notify({
        id: cuid(),
        message: `Error connecting to server at "${serviceAddress}"`,
        title: 'Connection timeout',
        type: notificationTypes.error,
      });

      updateTab({
        ...currentTab,
        inProgress: false,
      });
    }
  }, 5000);

  // Make the actual request
  client[methodName](payload, reqMetadata, (err: Error, results: object) => {
    if (err) {
      reqEnded = performance.now();

      logger.warn('gRPC request failed with error ', err);

      updateTab({
        ...currentTab,
        inProgress: false,
        results: err,
      });

      return;
    }

    reqEnded = performance.now();
    updateTab({
      ...currentTab,
      inProgress: false,
      meta: {
        status: ITabStatus.success,
        timestamp: reqEnded - reqStarted,
      },
      results,
    });

    client.close();
  });
};

const QueryPane: React.SFC<IQueryPaneProps> = ({
  activeTab,
  currentTab,
  notify,
  updateTab,
}) => {
  const [serviceAddress, setServiceAddress] = useState((currentTab && currentTab.address) || '');

  // Update the service address when the active tab changes
  useEffect(() => {
    setServiceAddress((currentTab && currentTab.address) || '');
  }, [activeTab]);

  // Attach and remove keyboard listeners. Run only once
  useEffect(() => {
    // Attach a shortcut for making requests
    attachIndividualShortcut({
      handler: () => handleDispatchRequest({
        currentTab,
        notify,
        serviceAddress: serviceAddress || '',
        updateTab,
      }),
      key: 'enter',
      label: 'Send Request',
      modifier: shortcutModifiers.general,
    });

    // Shortcut for saving tab data
    attachIndividualShortcut({
      handler: () => handleSaveTabData({
        currentTab,
        notify,
        serviceAddress,
        showNotification: true,
        updateTab,
      }),
      key: 's',
      label: 'Save Tab Data',
      modifier: shortcutModifiers.general,
    });

    return () => {
      unregisterShortcut('enter');
      unregisterShortcut('s');
    };
  }, []);

  return (
    <QueryPaneContainer data-testid="queryPane">
      <AddressBarContainer
        as="div"
      >
        <Input
          name="address"
          onChange={event => setServiceAddress(event.target.value || '')}
          placeholder="Service Address"
          required
          type="url"
          value={serviceAddress}
        />
        <Button
          disabled={!serviceAddress}
          onClick={() => handleDispatchRequest({
            currentTab,
            notify,
            serviceAddress: serviceAddress || '',
            updateTab,
          })}
        >
          Send Request
        </Button>
      </AddressBarContainer>

      <ParamBuilderContainer>
        <QueryTabs />

      </ParamBuilderContainer>
    </QueryPaneContainer>
  );
};

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  currentTab:
    state.layout.tabs.find(tab => tab.id === state.layout.activeTab) || {},
  tabs: state.layout.tabs,
});

const mapDispatchToProps = {
  notify: (item: INotification) => layoutActions.addNotification(item),
  updateTab: (tab: ITab) => layoutActions.updateTab(tab),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QueryPane);
