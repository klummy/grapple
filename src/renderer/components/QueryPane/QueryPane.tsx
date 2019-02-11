import * as React from "react";
import { connect } from "react-redux";

// import logger from '../../libs/logger';
import * as layoutActions from "../../store/layout/layout.actions";
import { IStoreState } from "../../types";
import { ITab } from "../../types/layout";

import logger from "../../libs/logger";
import {
  dispatchRequest,
  ICustomFields,
  loadFields
} from "../../services/grpc";
import {
  attachIndividualShortcut,
  shortcutModifiers,
  unregisterShortcut
} from "../../services/shortcuts";
import {
  Button,
  Form as AddressBarContainer,
  Input
} from "../GenericComponents";
import { QueryPaneContainer } from "./QueryPane.components";
import QueryParamBuilder from "./QueryParamBuilder";

export interface IQueryPaneProps {
  activeTab: string;
  currentTab: ITab;
  tabs: Array<ITab>;
  updateTab: (tab: ITab) => void;
}

export interface IQueryPaneState {
  requestFields?: Array<ICustomFields>;
}

class QueryPane extends React.Component<IQueryPaneProps, IQueryPaneState> {
  constructor(props: IQueryPaneProps) {
    super(props);
    this.addressRef = React.createRef();
  }

  addressRef: React.RefObject<any>;

  state = {
    requestFields: undefined
  };

  generatePayload(): object {
    const queryContainer = document.getElementById("queryParams");
    if (!queryContainer) {
      return {};
    }

    const inputs = queryContainer.querySelectorAll("[data-query-item]");
    const payload = {};

    inputs.forEach(input => {
      const inputElement = input as any;

      const inputName = inputElement.name;
      const inputValue = inputElement.value;

      // If it's nested field, put each value under the parent; else assign the name to the value
      if (inputName.includes("/")) {
        const [parent, self] = inputName.split("/");

        // TODO: This won't work well for multiple nested levels. Only the first level, revisit (will likely need a recursive function)
        payload[parent] = {
          ...payload[parent],
          [self]: inputValue
        };
      } else {
        payload[inputName] = inputValue;
      }
    });

    return payload;
  }

  /**
   * Make the request
   */
  handleDispatchRequest(event?: React.MouseEvent) {
    if (event) {
      event.preventDefault();
    }

    const input = this.addressRef.current;

    const serviceAddress = input && input.value;

    if (!serviceAddress) {
      // TODO: Flash notification here
      // TODO: Validate that serviceAddress is a valid URL
      // TODO: Grey out button and disable it if no serviceAddress
      logger.warn("No input provided");
      return;
    }

    const { currentTab } = this.props;

    const payload = this.generatePayload();

    if (currentTab) {
      const { updateTab } = this.props;

      this.saveTabData(serviceAddress, payload);

      dispatchRequest(currentTab, serviceAddress, payload)
        .then(results => {
          // Update the tab with the request data
          updateTab({
            ...currentTab,
            results
          });
        })
        .catch((err: Error) => {
          logger.error("Error during dispatch ", err);
        })
        .finally(() => {
          // TODO: Clear loading indications and show appropriate notifications
        });
    }
  }

  /**
   * Load the data for the tab when the app is loaded or the tab switched
   */
  loadTabData() {
    const { currentTab } = this.props;

    if (!currentTab || !currentTab.proto) {
      return;
    }

    const { proto, service = { originalName: "" } } = currentTab;

    loadFields(proto.path, (service as any).path)
      .then(({ fields }) => {
        this.setState({
          requestFields: fields
        });
      })
      .catch(err => {
        logger.error("Error loading fields for proto", err);
      });
  }

  /**
   * Save all the data in the data.
   */
  saveTabData(address?: string, payload?: object) {
    const { currentTab, updateTab } = this.props;

    if (currentTab) {
      updateTab({
        ...currentTab,
        address:
          address || (this.addressRef.current && this.addressRef.current.value),
        queryData: payload || this.generatePayload()
      });

      // TODO: Flash notification that the tab data is saved
    }
  }

  componentDidUpdate(prevProps: IQueryPaneProps, prevState: IQueryPaneState) {
    if (this.props.activeTab !== prevProps.activeTab) {
      this.loadTabData();

      // Clear/set the address when the tab is changed
      if (this.addressRef.current) {
        const { currentTab } = this.props;
        this.addressRef.current.value = currentTab.address || "";
      }
    }
  }

  componentDidMount() {
    const { activeTab } = this.props;

    if (activeTab) {
      this.loadTabData();

      // Attach a shortcut for making requests
      attachIndividualShortcut({
        handler: this.handleDispatchRequest.bind(this),
        key: "enter",
        label: "Send Request",
        modifier: shortcutModifiers.general
      });

      // Shortcut for saving tab data
      attachIndividualShortcut({
        handler: this.saveTabData.bind(this),
        key: "s",
        label: "Save Tab Data",
        modifier: shortcutModifiers.general
      });
    }
  }

  componentWillUnmount() {
    unregisterShortcut("enter");
    unregisterShortcut("s");
  }

  render() {
    const { requestFields } = this.state;
    const { currentTab } = this.props;

    return (
      <QueryPaneContainer>
        <AddressBarContainer as="div" action="">
          <Input
            type="url"
            name="address"
            placeholder="Service Address"
            ref={this.addressRef}
            defaultValue={currentTab.address}
          />
          <Button onClick={e => this.handleDispatchRequest(e)}>
            Send Request
          </Button>
        </AddressBarContainer>

        {requestFields && <QueryParamBuilder fields={requestFields} />}
      </QueryPaneContainer>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  currentTab:
    state.layout.tabs.find(tab => tab.id === state.layout.activeTab) || {},
  tabs: state.layout.tabs
});

const mapDispatchToProps = {
  updateTab: (tab: ITab) => layoutActions.updateTab(tab)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueryPane);