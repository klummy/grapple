import styled from 'styled-components'

import { ITabItemProps } from './tab.types';

// tslint:disable-next-line:no-any
export const TabItemComponent: any = styled.li`
  align-items: center;
  border-right: 1px solid #eee;
  background-color: ${(props: ITabItemProps) => props.active && '#eee'};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 100%;
  padding: 0 20px;
  transition: background-color .3s ease-in-out;
  width:  200px;

  &:hover {
    background-color: rgba(102, 102, 102, .1);
  }
`

export const TitleComponent = styled.span`
  display: inline-block;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity .3s ease-in-out;
  white-space: nowrap;

  &:hover {
    opacity: .6;
  }
`

export const CloseIcon = styled.span`
  display: inline-block;
  margin-left: auto;
  transition: opacity .3s ease-in-out;

  &:hover {
    opacity: .6;
  }
`