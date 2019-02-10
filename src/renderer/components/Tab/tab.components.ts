import styled from "styled-components";

import { ITabItemProps } from "./tab.types";

export const TabItemComponent: any = styled.li`
  align-items: center;
  border-right: 1px solid #eee;
  background-color: ${(props: ITabItemProps) =>
    props.active ? "rgba(8, 178, 227, .5)" : "rgba(239, 233, 244, 1)"};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 100%;
  opacity: 0.7;
  padding: 0 20px;
  transition: opacity 0.3s ease-in-out;
  width: 200px;

  &:hover {
    opacity: 0.9;
  }
`;

export const TitleComponent = styled.span`
  display: inline-block;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
`;

export const CloseIcon = styled.span`
  display: inline-block;
  margin-left: auto;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.6;
  }
`;
