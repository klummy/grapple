import styled from 'styled-components'

import { ISidebarState } from './sidebar.types';

export const Nav = styled.nav`
  background-color: ${(props: ISidebarState) => props.dragInProgress ? '#eee' : 'white'};
  box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
  flex-shrink: 0;
  transition: background-color .2s ease-in-out;
  width: 200px;
`