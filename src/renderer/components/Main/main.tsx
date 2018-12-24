import * as React from 'react';
import { connect } from 'react-redux';

import * as layoutActions from '../../store/layout/layout.actions';
import { IStoreState } from '../../types';
import { ITab } from '../../types/layout';

import Tab from '../../components/Tab';
import { OuterWrapper, TabListContainer } from './main.components';

export interface IMainProps {
  closeTab: (tab: ITab) => void
  tabs: Array<ITab>
}

const Main: React.SFC<IMainProps> = ({ closeTab, tabs }) => {
  return (
    <OuterWrapper>
      <TabListContainer>
        {
          Array.isArray(tabs) && tabs.length > 0 &&
          tabs.map((tab =>
            <Tab key={ tab.id } closeTab={ closeTab } tab={ tab } />
          ))
        }
      </TabListContainer>
    </OuterWrapper>
  );
}

const mapStateToProps = (state: IStoreState) => ({
  tabs: state.layout.tabs
})

const mapDispatchToProps = {
  closeTab: (tab: ITab) => layoutActions.closeTab(tab)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);