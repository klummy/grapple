import { MethodDefinition, PackageDefinition } from '@grpc/proto-loader';
import * as electron from 'electron';
import fs from 'fs';
import * as nodePath from 'path';
import * as React from 'react';
import { connect } from 'react-redux';

import { IProto } from '../../types/protos';
import { INotification, notificationTypes } from '../../types/layout';
import { IStoreState } from '../../types';

import { Nav, NewItemButton } from './sidebar.components';
import { ISidebarProps, ISidebarState } from './sidebar.types';

import NavProtoList from '../NavProtoList';
import AddIcon from '../Icons/add';

import {
  attachIndividualShortcut,
  shortcutModifiers,
} from '../../services/shortcuts';
import { humanFriendlyProtoName, validateProto } from '../../services/protos';
import logger from '../../libs/logger';

import * as layoutActions from '../../store/layout/layout.actions';
import * as projectActions from '../../store/projects/projects.actions';

import cuid = require('cuid');

class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  state = {
    dragInProgress: false, // If a drag event is in progress.
  };

  componentDidMount() {
    // Attach shortcut for opening proto file(s) from the file system dialog
    attachIndividualShortcut({
      handler: this.handleOpenFromDialog.bind(this),
      key: 'o',
      label: 'Open dialog',
      modifier: shortcutModifiers.general,
    });
  }

  handleDragLeave() {
    if (this.state.dragInProgress) {
      this.setState({
        dragInProgress: false,
      });
    }
  }

  handleDragOver(event: React.DragEvent<HTMLElement>) {
    if (!this.state.dragInProgress) {
      this.setState({
        dragInProgress: true,
      });
    }

    event.preventDefault();
  }

  /**
   * Handle successful file drop
   * @param event
   */
  handleOnDrop(event: React.DragEvent<HTMLElement>) {
    event.persist();
    event.preventDefault();

    // eslint-disable-next-line no-restricted-syntax
    for (const file of event.dataTransfer.files) {
      const proto = (file as unknown) as IProto;
      this.loadProto(proto);
    }
  }

  /**
   * Handle opening a Proto file from the file picker dialog
   */
  handleOpenFromDialog() {
    const { dialog } = electron.remote;

    const self = this;

    // TODO: In user preferences, allow user to specify root project folder
    dialog.showOpenDialog(
      {
        filters: [
          {
            extensions: ['proto'],
            name: 'Protos',
          },
        ],
        properties: ['openFile', 'multiSelections'],
      },
      (filePaths) => {
        if (filePaths && filePaths.length > 0) {
          filePaths.forEach((filePath) => {
            fs.stat(filePath, (err, stats) => {
              if (err) {
                logger.error('Error getting stats for filePath', filePath, err);
                // TODO: Show error notification
                return;
              }

              const proto = {
                lastModified: stats.mtime.getTime(),
                name: nodePath.basename(filePath),
                path: filePath,
              };

              self.loadProto(proto);
            });
          });
        }
      },
    );
  }

  loadProto(proto: IProto) {
    const { lastModified, path } = proto;
    const { notify, protos } = this.props;

    validateProto(proto)
      .then((pkgDef) => {
        // TODO: Check to make sure that the proto path hasn't already been added

        // Prevent duplicate files from being added
        const existsAlready = protos.find(
          item => item.path === proto.path,
        );

        if (existsAlready) {
          notify({
            id: cuid(),
            message: 'Proto file is already imported, use the refresh icon to update an existing file instead',
            title: 'Duplicate Error',
            type: notificationTypes.warn,
          });
        } else {
          this.props.addProtoToProject({
            lastModified,
            name: humanFriendlyProtoName(proto),
            path,
            pkgDef: pkgDef as PackageDefinition,
          });
        }
      })
      .catch((err) => {
        logger.warn('Proto validation failed: ', err);

        notify({
          id: cuid(),
          message: 'Error validating proto file, please check that the file is accurate',
          rawErr: err,
          title: 'Proto validation error',
          type: notificationTypes.error,
        });
      })
      .finally(() => {
        this.setState({
          dragInProgress: false,
        });
      });
  }

  newTabHandler(
    e: React.MouseEvent,
    proto: IProto,
    service: MethodDefinition<{}, {}>,
  ) {
    e.preventDefault();

    const { addTab } = this.props;

    addTab(proto, service);
  }

  render() {
    const { protos } = this.props;

    return (
      <Nav
        dragInProgress={this.state.dragInProgress}
        onDragLeave={() => this.handleDragLeave()}
        onDragOver={e => this.handleDragOver(e)}
        onDrop={e => this.handleOnDrop(e)}
      >
        <NavProtoList
          newTabHandler={(e, proto, service) => this.newTabHandler(e, proto, service)
          }
          protos={protos}
        />

        <NewItemButton onClick={() => this.handleOpenFromDialog()}>
          <AddIcon />
          <span>Add Proto</span>
        </NewItemButton>
      </Nav>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  protos: state.projects.protos,
});

const mapDispatchToProps = {
  addProtoToProject: (e: IProto) => projectActions.addProtoToProject(e),
  addTab:
    (proto: IProto, service: MethodDefinition<{}, {}>) => layoutActions.addTab({ proto, service }),
  notify: (item: INotification) => layoutActions.addNotification(item),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
