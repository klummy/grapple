import * as protoLoader from '@grpc/proto-loader';
import * as React from 'react';
import { connect } from 'react-redux';

// import logger from '../../libs/logger';
import { IStoreState } from '../../types';
import { ITab } from '../../types/layout';

import logger from '../../libs/logger';
import { ICustomFields, loadFields } from '../../services/grpc';
import AddressBar from './AddressBar';
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
  serviceAddress: string
  pkgDef: protoLoader.PackageDefinition
}

class QueryPane extends React.Component<IQueryPaneProps, IQueryPaneState> {

  state = {
    pkgDef: {},
    requestFields: undefined,
    serviceAddress: 'localhost:9284', // TODO: Test serviceAddress, replace with empty string
  }

  /**
   * Set the service serviceAddress
   */
  handleSetAddress(event: React.FormEvent) {
    event.preventDefault()

    const serviceAddress = (event.target as HTMLElement).querySelector("input")

    this.setState({
      serviceAddress: (serviceAddress && serviceAddress.value) || ''
    })
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

    if (activeTab) { this.loadTabData() }
  }

  render() {
    const { requestFields } = this.state

    // if (!pageData) {
    //   logger.warn('Page data empty, possible error in data.')

    //   return (
    //     // TODO: Empty State
    //     <QueryPanEmptyStateContainer>
    //       Undone empty state
    //     </QueryPanEmptyStateContainer>
    //   )
    // }

    return (
      <QueryPaneContainer>
        <AddressBar handleSetAddress={ (e) => this.handleSetAddress(e) } />

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