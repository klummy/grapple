import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as layoutActions from '../../store/layout/layout.actions';
import { IStoreState } from '../../types';
import { ITab, INotification, notificationTypes } from '../../types/layout';


import logger from '../../libs/logger';
import { dispatchRequest } from '../../services/grpc';
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
const handleDispatchRequest = (params: {
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
    logger.warn('No input provided');
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

  dispatchRequest({
    metadata,
    payload,
    serviceAddress,
    tab: currentTab,
  })
    .then(({
      response: results,
      meta,
    }) => {
      // Update the tab with the request data
      updateTab({
        ...currentTab,
        address: serviceAddress,
        inProgress: false,
        meta,
        queryData: payload,
        results,
      });
    })
    .catch(({
      meta,
      response: err,
    }) => {
      logger.warn('Error during dispatch ', err);

      updateTab({
        ...currentTab,
        address: serviceAddress,
        inProgress: false,
        meta,
        queryData: payload,
        results: {
          error: {
            ...err,
          },
          status: 'Error completing request',
        },
      });

      notify({
        id: cuid(),
        message: err.message,
        rawErr: err,
        title: 'Error completing request',
        type: notificationTypes.error,
      });
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
