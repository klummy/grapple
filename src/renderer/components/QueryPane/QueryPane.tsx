import * as protoLoader from '@grpc/proto-loader';
import * as React from 'react';
import { connect } from 'react-redux';

// import logger from '../../libs/logger';
import { IStoreState } from '../../types';
import { ITab } from '../../types/layout';

import logger from '../../libs/logger';
import { dispatchRequest, ICustomFields, loadFields } from '../../services/grpc';
import {
  Button,
  Form as AddressBarContainer,
  Input,
} from '../GenericComponents';
import {
  QueryPaneContainer
} from './QueryPane.components';
import QueryPaneParams from './QueryParams';

// TODO: NOTE: All the tab data shouldn't be here but set in the tab itself. e.g. serviceAddress

export interface IQueryPaneProps {
  activeTab: string
  tabs: Array<ITab>
}

export interface IQueryPaneState {
  requestFields?: Array<ICustomFields>
  pkgDef: protoLoader.PackageDefinition
}

class QueryPane extends React.Component<IQueryPaneProps, IQueryPaneState> {
  constructor(props: IQueryPaneProps) {
    super(props)
    this.addressRef = React.createRef()
  }

  // tslint:disable-next-line:no-any
  addressRef: React.RefObject<any>

  state = {
    pkgDef: {},
    requestFields: undefined,
  }

  /**
   * Make the request
   */
  handleDispatchRequest(event: React.MouseEvent) {
    event.preventDefault()

    const input = this.addressRef.current

    const serviceAddress = (input && input.value) || 'localhost:9284' // TODO: Test serviceAddress, remove

    // TODO: Move all related data (including the service address into the tab)
    const tab = this.props.tabs.find(t => t.id === this.props.activeTab)

    const payload = {}

    if (tab) {
      dispatchRequest(tab, serviceAddress, payload)
    }
  }

  /**
   * Load the data for the tab when the app is loaded or the tab switched
   */
  loadTabData() {
    const { activeTab, tabs } = this.props

    const currentTab = tabs.find(tab => tab.id === activeTab)

    if (!currentTab || !currentTab.proto) { return }

    const {
      proto,
      service = { originalName: '' }
    } = currentTab

    // tslint:disable-next-line:no-any
    loadFields(proto.path, (service as any).path)
      .then(({ fields }) => {
        this.setState({
          requestFields: fields
        })
      })
      .catch(err => {
        logger.error('Error loading fields for proto', err)
      })
  }

  componentDidUpdate(prevProps: IQueryPaneProps, prevState: IQueryPaneState) {
    if (this.props.activeTab !== prevProps.activeTab) {
      this.loadTabData()
    }
  }

  componentDidMount() {
    const { activeTab } = this.props

    if (activeTab) {
      this.loadTabData()
    }
  }

  render() {
    const { requestFields } = this.state

    return (
      <QueryPaneContainer>
        <AddressBarContainer as="div" action="">
          <Input type="url" name="address" placeholder="Service Address" ref={ this.addressRef } />
          <Button onClick={ e => this.handleDispatchRequest(e) }>Send Request</Button>
        </AddressBarContainer>

        <QueryPaneParams fields={ requestFields } />
      </QueryPaneContainer>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  tabs: state.layout.tabs,
})

export default connect(mapStateToProps)(QueryPane);