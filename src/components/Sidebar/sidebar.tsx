import * as React from 'react';

import { Nav } from './sidebar.components';

import { ISidebarProps, ISidebarState } from './sidebar.types';

class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  state = {
    dragInProgress: false, // If a drag event is in progress.
  }

  handleDragLeave() {
    if (this.state.dragInProgress) {
      this.setState({
        dragInProgress: false
      })
    }
  }

  handleDragOver(e: React.DragEvent<HTMLElement>) {
    if (!this.state.dragInProgress) {
      this.setState({
        dragInProgress: true
      })
    }
  }

  render() {
    return (
      <Nav
        onDragLeave={ () => this.handleDragLeave() }
        onDragOver={ (e) => this.handleDragOver(e) }
        dragInProgress={ this.state.dragInProgress }>
        <span>Shows</span>
      </Nav>
    );
  }
}

export default Sidebar;
