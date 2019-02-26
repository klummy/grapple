import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as layoutActions from '../../store/layout/layout.actions';
import { IStoreState } from '../../types';
import { ITab, INotification, notificationTypes } from '../../types/layout';


import logger from '../../libs/logger';
import {
  dispatchRequest,
  ICustomFields,
  loadFields,
} from '../../services/grpc';
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
  requestFields?: ICustomFields[];
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

const handleSaveTabData = (params: {
  currentTab: ITab,
  notify: (item: INotification) => void,
  payload?: object,
  serviceAddress?: string,
  showNotification: boolean,
  updateTab: (tab: ITab) => void,
}) => {
  const {
    currentTab,
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
      .then(({ fields }) => resolve(fields))
      .catch((err) => {
        logger.error('Error loading fields for proto', err);
        reject(Error);
      });
  });
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

  if (currentTab) {
    handleSaveTabData({
      currentTab,
      notify,
      payload,
      serviceAddress,
      showNotification: false,
      updateTab,
    });

    dispatchRequest(
      currentTab,
      serviceAddress,
      payload,
    )
      .then(({
        response: results,
        meta,
      }) => {
        // Update the tab with the request data
        updateTab({
          ...currentTab,
          address: serviceAddress,
          meta,
          queryData: payload,
          results,
        });
      })
      .catch(({
        response,
        meta,
      }) => {
        const err = response as Error;

        logger.warn('Error during dispatch ', err);

        // Create the error object to be displayed to the user
        updateTab({
          ...currentTab,
          address: serviceAddress,
          meta,
          queryData: payload,
          results: {
            error: {
              ...err,
            },
            status: 'Error completing request',
          },
        });
      })
      .finally(() => {
        // TODO: Clear loading indications and show appropriate notifications
      });
  }
};

const QueryPane: React.SFC<IQueryPaneProps> = ({
  activeTab,
  currentTab,
  notify,
  updateTab,
}) => {
  const [requestFields, setRequestFields] = useState<ICustomFields[] | undefined>(undefined);
  const [serviceAddress, setServiceAddress] = useState((currentTab && currentTab.address) || '');

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
        <QueryTabs requestFields={requestFields} />

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
