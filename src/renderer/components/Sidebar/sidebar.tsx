import { MethodDefinition, PackageDefinition } from '@grpc/proto-loader';
import * as electron from 'electron';
import fs from 'fs';
import * as nodePath from 'path';
import React, { useState, useContext, useEffect } from 'react';
import { IProto } from '../../types/protos';
import { notificationTypes } from '../../types/layout';
import { Nav, NewItemButton } from './sidebar.components';
import NavProtoList from '../NavProtoList';
import AddIcon from '../Icons/add';
import {
  attachIndividualShortcut,
  shortcutModifiers,
} from '../../services/shortcuts';
import { loadProtoServices } from '../../services/grpc';
import { humanFriendlyProtoName, validateProto } from '../../services/protos';
import logger from '../../libs/logger';
import * as layoutActions from '../../store/layout/layout.actions';
import * as projectActions from '../../store/projects/projects.actions';
import {
  ProjectContext, LayoutContext, IGenericContext, ILayoutContext,
} from '../../contexts';
import { IProject } from '../../types/projects';

import cuid = require('cuid');

interface IContexts {
  layoutContext: ILayoutContext,
  projectContext: IGenericContext<IProject>
}

const loadProto = (
  proto: IProto,
  contexts: IContexts,
  cleanupCb: () => void,
  refresh?: boolean,
) => {
  const { lastModified, path } = proto;

  const {
    layoutContext,
    projectContext,
  } = contexts;

  const { notify } = layoutContext;
  const {
    dispatch: projectDispatcher,
    state: projectState,
  } = projectContext;

  const { protos } = projectState as IProject;

  const addProtoToProject = (e: IProto) => projectDispatcher(projectActions.addProtoToProject(e));
  const updateProto = (e: IProto) => projectDispatcher(projectActions.updateProto(e));

  validateProto(proto)
    .then((pkgDef) => {
      // Prevent duplicate files from being added
      const existsAlready = protos.find(
        item => item.path === proto.path,
      );

      const protoItem = {
        lastModified,
        name: humanFriendlyProtoName(proto),
        path,
        pkgDef: pkgDef as PackageDefinition,
      };

      // Update the proto here if it's a refresh
      if (refresh) {
        updateProto(protoItem);
        return;
      }

      // If it exists already, refresh the proto automatically
      if (existsAlready) {
        updateProto(protoItem);

        notify({
          id: cuid(),
          message: `"${proto.name}" is already imported, refreshing file contexts.`,
          title: `Duplicate Error - ${proto.name}`,
          type: notificationTypes.warn,
        });

        return;
      }

      const protoWithServices = loadProtoServices(protoItem);

      // Add a new proto to the project
      addProtoToProject(protoWithServices);
    })
    .catch((err) => {
      logger.warn('Proto validation failed: ', err);

      notify({
        id: cuid(),
        message: `Error validating "${proto.name}",
        please check that the file is a valid Protocol Buffer file`,
        rawErr: err,
        title: 'Unable to add file',
        type: notificationTypes.error,
      });
    })
    .finally(() => {
      cleanupCb();
    });
};

const SidebarSFC: React.SFC<{}> = () => {
  const [dragInProgress, setDragInProgress] = useState(false);

  const layoutContext = useContext(LayoutContext);
  const projectContext = useContext(ProjectContext);

  const {
    dispatch: layoutDispatcher,
    notify,
  } = layoutContext;

  const {
    state: projectState,
  } = projectContext;
  const { protos } = projectState as IProject;

  const addTab = (
    proto: IProto,
    service: MethodDefinition<{}, {}>,
  ) => layoutDispatcher(layoutActions.addTab({ proto, service }));

  const contexts = {
    layoutContext,
    projectContext,
  };

  /**
   * Handle opening a Proto file from the file picker dialog
   */
  const handleOpenFromDialog = () => {
    const { dialog } = electron.remote;

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
                notify({
                  id: cuid(),
                  message: `Error opening file ${filePath}.`,
                  rawErr: err,
                  title: 'Error',
                  type: notificationTypes.error,
                });
                return;
              }

              const proto = {
                lastModified: stats.mtime.getTime(),
                name: nodePath.basename(filePath),
                path: filePath,
              };

              loadProto(
                proto,
                contexts,
                () => {
                  setDragInProgress(false);
                },
              );
            });
          });
        }
      },
    );
  };

  useEffect(() => {
    // Attach shortcut for opening proto file(s) from the file system dialog
    attachIndividualShortcut({
      handler: handleOpenFromDialog,
      key: 'o',
      label: 'Open dialog',
      modifier: shortcutModifiers.general,
    });
  }, []);

  return (
    <Nav
      dragInProgress={dragInProgress}
      onDragLeave={() => {
        if (dragInProgress) {
          setDragInProgress(false);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();

        if (!dragInProgress) {
          setDragInProgress(true);
        }
      }}
      onDrop={(event) => {
        event.persist();
        event.preventDefault();

        // eslint-disable-next-line no-restricted-syntax
        for (const file of event.dataTransfer.files) {
          const proto = (file as unknown) as IProto;
          loadProto(
            proto,
            contexts,
            () => {
              setDragInProgress(false);
            },
          );
        }
      }}
    >
      <NavProtoList
        newTabHandler={(event, proto, service) => {
          event.preventDefault();
          addTab(proto, service);
        }
        }
        protos={protos}
        refreshProto={proto => loadProto(
          proto,
          contexts,
          () => { },
          true,
        )}
      />

      <NewItemButton onClick={() => handleOpenFromDialog()}>
        <AddIcon />
        <span>Add Proto</span>
      </NewItemButton>
    </Nav>
  );
};

export default SidebarSFC;
