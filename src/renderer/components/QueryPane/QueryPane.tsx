import React from 'react';
import { connect } from 'react-redux';

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
  Form as AddressBarContainer,
  Input,
} from '../GenericComponents';
import {
  QueryPaneContainer,
  ParamBuilderContainer,
} from './QueryPane.components';
import QueryTabs from '../QueryTabs';

import cuid = require('cuid');

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

class QueryPane extends React.Component<IQueryPaneProps, IQueryPaneState> {
  constructor(props: IQueryPaneProps) {
    super(props);

    this.state = {
      requestFields: undefined,
      serviceAddress: (props.currentTab && props.currentTab.address) || '',
    };
  }


  componentDidMount() {
    const { activeTab } = this.props;

    if (activeTab) {
      this.loadTabData();

      // Attach a shortcut for making requests
      attachIndividualShortcut({
        handler: this.handleDispatchRequest.bind(this),
        key: 'enter',
        label: 'Send Request',
        modifier: shortcutModifiers.general,
      });

      // Shortcut for saving tab data
      attachIndividualShortcut({
        handler: this.saveTabData.bind(this),
        key: 's',
        label: 'Save Tab Data',
        modifier: shortcutModifiers.general,
      });
    }
  }

  componentDidUpdate(prevProps: IQueryPaneProps) {
    const { activeTab } = this.props;

    if (activeTab !== prevProps.activeTab) {
      this.loadTabData();

      // Clear/set the address when the tab is changed
      if (this.state.serviceAddress) {
        const { currentTab } = this.props;

        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          serviceAddress: currentTab.address || '',
        });
      }
    }
  }

  componentWillUnmount() {
    unregisterShortcut('enter');
    unregisterShortcut('s');
  }

  /**
 * Make the request
 */
  handleDispatchRequest(event?: React.MouseEvent) {
    if (event) {
      event.preventDefault();
    }

    const { serviceAddress } = this.state;

    const { notify } = this.props;

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

    const { currentTab } = this.props;

    const payload = generatePayload();

    if (currentTab) {
      const { updateTab } = this.props;

      this.saveTabData(serviceAddress, payload, false);

      dispatchRequest(
        currentTab,
        serviceAddress,
        payload,
      )
        .then((results) => {
          // Update the tab with the request data
          updateTab({
            ...currentTab,
            address: serviceAddress,
            queryData: payload,
            results,
          });
        })
        .catch((err: Error) => {
          logger.warn('Error during dispatch ', err);

          // Create the error object to be displayed to the user
          updateTab({
            ...currentTab,
            address: serviceAddress,
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
  }

  /**
   * Handle updating the service address input
   * @param event Input event
   */
  handleServiceAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      serviceAddress: event.target.value,
    });
  }

  /**
 * Load the data for the tab when the app is loaded or the tab switched
 */
  loadTabData() {
    const { currentTab } = this.props;

    if (!currentTab || !currentTab.proto) {
      return;
    }

    const { proto, service = { originalName: '' } } = currentTab;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadFields(proto.path, (service as any).path)
      .then(({ fields }) => {
        this.setState({
          requestFields: fields,
        });
      })
      .catch((err) => {
        logger.error('Error loading fields for proto', err);
      });
  }

  /**
   * Save all the data in the data.
   */
  saveTabData(address?: string, payload?: object, showNotification = true) {
    const { currentTab, notify, updateTab } = this.props;

    if (currentTab) {
      updateTab({
        ...currentTab,
        address: this.state.serviceAddress,
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
  }

  render() {
    const { requestFields, serviceAddress } = this.state;

    return (
      <QueryPaneContainer data-testid="queryPane">
        <AddressBarContainer
          as="div"
        >
          <Input
            name="address"
            onChange={e => this.handleServiceAddressChange(e)}
            placeholder="Service Address"
            required
            type="url"
            value={serviceAddress}
          />
          <Button
            disabled={!serviceAddress}
            onClick={e => this.handleDispatchRequest(e)}
          >
            Send Request
          </Button>
        </AddressBarContainer>

        <ParamBuilderContainer>
          <QueryTabs requestFields={requestFields} />

        </ParamBuilderContainer>
      </QueryPaneContainer>
    );
  }
}

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
