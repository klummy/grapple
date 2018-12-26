import { MethodDefinition } from '@grpc/proto-loader';
import * as React from 'react';
import { connect } from 'react-redux';

import { IProto } from '../../types/protos';
import { Nav, } from './sidebar.components';
import { ISidebarProps, ISidebarState } from './sidebar.types';

import logger from '../../libs/logger';
import { humanFriendlyProtoName, validateProto } from '../../services/protos';
import NavProtoList from '../NavProtoList';

import * as layoutActions from '../../store/layout/layout.actions';
import * as projectActions from '../../store/projects/projects.actions';
import { IStoreState } from '../../types';

class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  state = {
    actionInProgress: false, // If an action is in progress
    dragInProgress: false, // If a drag event is in progress.
  }

  handleDragLeave() {
    if (this.state.dragInProgress) {
      this.setState({
        dragInProgress: false
      })
    }
  }

  handleDragOver(event: React.DragEvent<HTMLElement>) {
    if (!this.state.dragInProgress) {
      this.setState({
        dragInProgress: true
      })
    }

    event.preventDefault()
  }

  handleOnDrop(event: React.DragEvent<HTMLElement>) {
    event.persist()
    event.preventDefault()

    for (const file of event.dataTransfer.files) {
      const proto = (file as unknown as IProto)
      const { lastModified, path } = proto

      validateProto(proto)
        .then((pkgDef) => {
          this.props.addProtoToProject({
            lastModified,
            name: humanFriendlyProtoName(proto),
            path,
            pkgDef
          })
        })
        .catch(err => {
          logger.warn('Proto validation failed: ', err)
        })
        .finally(() => {
          this.setState({
            actionInProgress: false,
            dragInProgress: false
          })
        })
    }
  }

  newTabHandler(e: React.MouseEvent, proto: IProto, service: MethodDefinition<{}, {}>) {
    e.preventDefault()

    const { addTab } = this.props

    addTab(proto, service)
  }

  render() {
    const { protos } = this.props

    return (
      <Nav
        dragInProgress={ this.state.dragInProgress }
        onDragLeave={ () => this.handleDragLeave() }
        onDragOver={ (e) => this.handleDragOver(e) }
        onDrop={ (e) => this.handleOnDrop(e) }
      >
        <NavProtoList
          newTabHandler={ (e, proto, service) => this.newTabHandler(e, proto, service) }
          protos={ protos } />
      </Nav>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  protos: state.projects.protos
})

const mapDispatchToProps = {
  addProtoToProject: (e: IProto) => projectActions.addProtoToProject(e),
  addTab: (proto: IProto, service: MethodDefinition<{}, {}>) => layoutActions.addTab({ proto, service }),
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
