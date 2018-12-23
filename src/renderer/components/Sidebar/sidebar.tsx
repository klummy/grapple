import * as React from 'react';
import { connect } from 'react-redux';

import { IProto } from '../../types/protos';
import { Nav, NavProtoItem, NavProtoList } from './sidebar.components';
import { ISidebarProps, ISidebarState } from './sidebar.types';

import logger from '../../libs/logger';
import { humanFriendlyProtoName, validateProto } from '../../services/protos';

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
        .then(() => {
          this.props.addProtoToProject({
            lastModified,
            name: humanFriendlyProtoName(proto),
            path,
          })
        })
        .catch(err => {
          logger.warn('Proto validation failed: ', err)
        })
        .finally(() => {
          this.setState({
            actionInProgress: false
          })
        })
    }
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

        {
          Array.isArray(protos) && protos.length > 0 && (
            <NavProtoList>
              {
                protos.map(proto => (
                  <NavProtoItem key={ proto.name }>
                    <a href="">
                      { proto.name }
                    </a>
                  </NavProtoItem>)
                )
              }
            </NavProtoList>
          )
        }


        <span>Shows</span>
      </Nav>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  protos: state.projects.protos
})

const mapDispatchToProps = {
  addProtoToProject: (e: IProto) => projectActions.addProtoToProject(e)
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
