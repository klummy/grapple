import * as React from 'react';
import { connect } from 'react-redux';

import { IProto } from '../../types/protos';
import { Nav } from './sidebar.components';
import { ISidebarProps, ISidebarState } from './sidebar.types';

import logger from '../../libs/logger';
import { validateProto } from '../../libs/utils';

import * as projectActions from '../../store/projects/projects.actions';

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

    // event.stopPropagation()
    event.preventDefault()
  }

  handleOnDrop(event: React.DragEvent<HTMLElement>) {
    event.persist()
    event.preventDefault()

    for (const file of event.dataTransfer.files) {
      const proto = (file as unknown as IProto)

      validateProto(proto)
        .then(() => {
          this.props.addProtoToProject({
            lastModified: proto.lastModified,
            name: proto.name,
            path: proto.path,
          })
        })
        .catch(err => {
          logger.warn('Proto validation failed')
        })
        .finally(() => {
          this.setState({
            actionInProgress: false
          })
        })
    }
  }

  render() {
    return (
      <Nav
        dragInProgress={ this.state.dragInProgress }
        onDragLeave={ () => this.handleDragLeave() }
        onDragOver={ (e) => this.handleDragOver(e) }
        onDrop={ (e) => this.handleOnDrop(e) }
      >
        <span>Shows</span>
      </Nav>
    );
  }
}

const mapDispatchToProps = {
  addProtoToProject: (e: IProto) => projectActions.addProtoToProject(e)
}

export default connect(null, mapDispatchToProps)(Sidebar);
