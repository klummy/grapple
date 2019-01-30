import { MethodDefinition } from '@grpc/proto-loader';
import { PackageDefinition } from "@grpc/proto-loader";
import * as electron from 'electron';
import fs from 'fs';
import * as nodePath from 'path';
import * as React from 'react';
import { connect } from 'react-redux';

import { IProto } from '../../types/protos';
import { Nav, } from './sidebar.components';
import { ISidebarProps, ISidebarState } from './sidebar.types';

import logger from '../../libs/logger';
import { humanFriendlyProtoName, validateProto } from '../../services/protos';
import NavProtoList from '../NavProtoList';

import { attachIndividualShortcut, shortcutModifiers } from '../../services/shortcuts';
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

  /**
   * Handle successful file drop
   * @param event
   */
  handleOnDrop(event: React.DragEvent<HTMLElement>) {
    event.persist()
    event.preventDefault()

    for (const file of event.dataTransfer.files) {
      const proto = (file as unknown as IProto)
      this.loadProto(proto)
    }
  }

  /**
   * Handle opening a Proto file from the file picker dialog
   */
  handleOpenFromDialog() {
    const { dialog } = electron.remote

    const self = this

    // TODO: In user preferences, allow user to specify root project folder
    // TODO: Remember last folder user loaded protos from (under user preference)
    dialog.showOpenDialog({
      filters: [
        {
          extensions: ["proto"],
          name: "Protos",
        }
      ],
      properties: ['openFile', 'multiSelections']
    }, (filePaths) => {
      filePaths.forEach(filePath => {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            logger.error('Error getting stats for filePath', filePath, err)
            // TODO: Show error notification
            return
          }

          const proto = {
            lastModified: stats.mtime.getTime(),
            name: nodePath.basename(filePath),
            path: filePath,
          }

          self.loadProto(proto)
        })
      })
    })
  }

  loadProto(proto: IProto) {
    const { lastModified, path } = proto

    validateProto(proto)
      .then((pkgDef) => {
        // TODO: Check to make sure that the proto path hasn't already been added

        this.props.addProtoToProject({
          lastModified,
          name: humanFriendlyProtoName(proto),
          path,
          pkgDef: (pkgDef as PackageDefinition)
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

  newTabHandler(e: React.MouseEvent, proto: IProto, service: MethodDefinition<{}, {}>) {
    e.preventDefault()

    const { addTab } = this.props

    addTab(proto, service)
  }

  componentDidMount() {
    // Attach shortcut for opening proto file(s) from the file system dialog
    attachIndividualShortcut({
      handler: this.handleOpenFromDialog.bind(this),
      key: 'o',
      label: 'Open dialog',
      modifier: shortcutModifiers.general,
    })
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

        { /* TODO: Style button below */ }
        <button onClick={ () => this.handleOpenFromDialog() }>Open File</button>
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
