import * as React from 'react';

import CloseIcon from '../Icons/close';

import { TabItemComponent, TitleComponent } from './tab.components';
import { ITabItemProps } from './tab.types';

const Tab: React.SFC<ITabItemProps> = ({
  active,
  tab,
  closeTab,
  switchTab,
}) => {
  const { name } = tab;

  return (
    <TabItemComponent
      active={active}
      onClick={() => switchTab(tab)}
    >
      <TitleComponent>{name || 'Untitled Request'}</TitleComponent>

      <CloseIcon
        onClick={(e) => {
          e.stopPropagation();
          closeTab(tab);
        }}
      />
    </TabItemComponent>
  );
};

export default Tab;
