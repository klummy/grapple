import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as React from 'react';
import { connect } from 'react-redux';

import logger from '../../libs/logger';
import { IStoreState } from '../../types';
import { ITab } from '../../types/layout';
import { IProto } from '../../types/protos';

import AddressBar from './AddressBar';
import {
  QueryPaneContainer,
  QueryPanEmptyStateContainer
} from './QueryPane.components';

// TODO: NOTE: All the tab data shouldn't be here but set in the tab itself. e.g. serviceAddress

export interface IQueryPaneProps {
  activeTab: string
  tabs: Array<ITab>
}

export interface IQueryPaneState {
  serviceAddress: string
  pageData: IProto
  pkgDef: protoLoader.PackageDefinition
}

class QueryPane extends React.Component<IQueryPaneProps, IQueryPaneState> {

  state = {
    pageData: {
      lastModified: 0,
      name: '',
      path: ''
    },
    pkgDef: {},
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
    const { serviceAddress } = this.state

    const currentTab = tabs.find(tab => tab.id === activeTab)

    if (!currentTab || !currentTab.proto) { return }

    // TODO: Load proto details here
    const { proto } = currentTab
    protoLoader.load(proto.path, {
      defaults: true,
      enums: String,
      keepCase: true,
      longs: String,
      oneofs: true
    })
      .then(pkgDef => {
        const pkgObject = grpc.loadPackageDefinition(pkgDef)

        const serviceIndex = Object.keys(pkgObject)[0]
        const serviceName = Object.keys(pkgObject[serviceIndex])[0]

        const credentials = grpc.credentials.createInsecure()
        const options = {
          'grpc.keepalive_time_ms': 15000,
          'grpc.max_reconnect_backoff_ms': 1000,
          'grpc.min_reconnect_backoff_ms': 1000,
        };


        const client = new pkgObject[serviceIndex][serviceName](serviceAddress, credentials, options)

        console.log('serviceAddress => ', serviceAddress);

        console.log('pkgObject => ', pkgObject);

        console.log('client => ', client);

        const sampleProject = {
          applications: [],
          // created: {},
          id: 1345,
          // modified: {},
          name: 'nom',
          owner: 'owner',
        }

        logger.info('Waiting for client connection to be ready')
        client.waitForReady(50000, (err: Error) => {
          logger.info('Connection ready')

          // tslint:disable-next-line no-any
          client.CreateProject(sampleProject, (error: Error, response: any) => {
            console.log('error => ', error);
            console.log('response => ', response);
          })
        })

        this.setState({
          pkgDef
        })
      })
      .catch(err => {
        logger.error('Error loading Proto file - ', err)
        // TODO: Display error
      })

    this.setState({
      pageData: proto
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
    const { pageData } = this.state

    if (!pageData) {
      logger.warn('Page data empty, possible error in data.')

      return (
        // TODO: Empty State
        <QueryPanEmptyStateContainer>
          Undone empty state
        </QueryPanEmptyStateContainer>
      )
    }

    return (
      <QueryPaneContainer>
        <AddressBar handleSetAddress={ (e) => this.handleSetAddress(e) } />

        { pageData.name }
      </QueryPaneContainer>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  tabs: state.layout.tabs,
})

export default connect(mapStateToProps)(QueryPane);