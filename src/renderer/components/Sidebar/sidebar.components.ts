import styled from 'styled-components'

import { ISidebarState } from './sidebar.types';

export const Nav = styled.nav`
  background-color: ${(props: ISidebarState) => props.dragInProgress ? '#eee' : 'white'};
  box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
  flex-shrink: 0;
  transition: background-color .2s ease-in-out;
  width: 200px;
`

export const NavProtoList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

export const NavProtoItem = styled.li`
  display: flex;
  text-transform: capitalize;
`

export const NavProtoItemLink = styled.a`
  border-bottom: 1px solid rgba(151,151,151,0.30);
  color: inherit;
  display: block;
  font-size: 16px;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  text-decoration: none;
  text-overflow: ellipsis;
  transition: background-color .3s ease-in;
  width: 100%;

  &:hover {
    background-color: rgba(151,151,151,0.20);
  }
`