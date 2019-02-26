import * as React from 'react';
import styled from 'styled-components';

export const HeaderTabContainer = styled.div`
  background-color: var(--color-black-alt-darker);
  border-radius: 3px;
`;

const HeaderItemButton = styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  margin: 5px 0;
  opacity: ${(props: { active: boolean }) => (props.active ? '.8' : '.5')};
  padding: 5px 10px;
  transition: opacity .3s ease-in-out;

  &:first-child {
    margin-left: 5px;
  }

  &:hover {
    opacity: ${(props: { active: boolean }) => (props.active ? '.9' : '.6')};
  }

  &:focus {
    border-color: var(--color-lines-default);
    outline: none;
  }
`;

export const HeaderItem: React.SFC<{
  currentTab: number
  onClick: (e: React.MouseEvent) => void
  tabID: number
  title: string
}> = ({
  currentTab,
  onClick,
  tabID,
  title,
}) => {
  return (
      // eslint-disable-next-line react/jsx-indent
      <HeaderItemButton
        active={currentTab === tabID}
        onClick={onClick}
        type="button"
      >
        {title}
      </HeaderItemButton>
  );
};

export const TabsContainer = styled.div`
  height: 100%;
`;
