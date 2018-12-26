import { MethodDefinition } from '@grpc/proto-loader';
import * as React from 'react';

import logger from '../../libs/logger';
import { IProto } from '../../types/protos';
import {
  NavProtoItemContainer,
  NavProtoItemHeader,
  NavProtoItemHeaderContainer,
  NavProtoItemHeaderIcon,
  NavProtoItemServicesItem,
  NavProtoItemServicesList,
} from './NavProtoList.components';

export interface INavProtoItemProps {
  newTabHandler: (e: React.MouseEvent, proto: IProto, service: MethodDefinition<{}, {}>) => void
  proto: IProto
}

export interface INavProtoItemState {
  showSettings: boolean
}

class NavProtoItem extends React.Component<INavProtoItemProps, INavProtoItemState> {
  state = {
    showSettings: false
  }

  toggleShowSettings() {
    this.setState(state => ({
      showSettings: !state.showSettings
    }))
  }

  render() {
    const { proto, newTabHandler } = this.props
    const { showSettings } = this.state

    const { pkgDef } = proto

    if (!pkgDef) {
      logger.error('Package definitions not present in proto definition')
      return null
    }

    // Service name
    const pkgIndex = Object.keys(pkgDef)[0]
    const pkgName = (pkgIndex.match(/\.[^.]*$/) || [''])[0].replace('.', '')

    const servicesObj = pkgDef[pkgIndex]
    const services = Object.keys(servicesObj)
      .map(key => servicesObj[key])
      .sort((a, b) => {
        const aName = a.originalName || ''
        const bName = b.originalName || ''

        return aName.localeCompare(bName, 'en', {
          sensitivity: 'base'
        })
      })

    return (
      <NavProtoItemContainer>
        <NavProtoItemHeaderContainer>
          <NavProtoItemHeader>
            { pkgName }
          </NavProtoItemHeader>

          <NavProtoItemHeaderIcon className="ti-settings" onClick={ () => this.toggleShowSettings() } />
          {
            // TODO: Implement dropdown
            showSettings && <span>Settings</span>
          }
        </NavProtoItemHeaderContainer>

        <NavProtoItemServicesList>
          {
            services.map(service => (
              <NavProtoItemServicesItem
                key={ service.originalName }
                onClick={ (e) => newTabHandler(e, proto, service) }
              >
                { service.originalName }
              </NavProtoItemServicesItem>
            ))
          }
        </NavProtoItemServicesList>
      </NavProtoItemContainer>
    )
  }
}

export default NavProtoItem;