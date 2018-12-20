import styled from 'styled-components'

import { ISidebarState } from './sidebar.types';

export const Nav = styled.nav`
  background-color: ${(props: ISidebarState) => props.dragInProgress ? '#eee' : 'white'};
  transition: background-color .2s ease-in-out;
  width: 200px;
`