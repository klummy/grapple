import styled from 'styled-components';

import { ISidebarState } from './sidebar.types';

export const Nav = styled.nav`
  background-color: ${(props: ISidebarState) => (props.dragInProgress
    ? 'rgba(87, 167, 115, .3)'
    : 'var(--color-black-default)')};
  border-top: 1px solid var(--color-lines-default);
  border-right: 1px solid var(--color-lines-default);
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  font-family: var(--font-alternate-stack);
  overflow-y: auto;
  padding-bottom: 50px;
  transition: background-color 0.2s ease-in-out;
  width: 300px;
  z-index: 20;
`;

export const NewItemButton = styled.button`
  align-items: center;
  background-color: var(--color-black-alt-darker);
  border: none;
  border-right: 1px solid var(--color-lines-default);
  bottom: 0;
  color: var(--text-color-default);
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: normal;
  height: 50px;
  padding-left: 25px;
  position: fixed;
  text-align: left;
  width: 300px;

  span {
    transition: color 0.2s ease-in-out;
  }

  svg {
    margin-right: 15px;

    & path {
      fill: var(--text-color-default);
      transition: fill 0.2s ease-in-out;
    }
  }

  &:hover {
    color: #fff;

    svg path {
      fill: #389bff;
    }
  }

  &:focus {
    outline: none;
  }
`;
