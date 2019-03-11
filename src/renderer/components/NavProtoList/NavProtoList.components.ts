import styled from 'styled-components';

export const NavProtoListContainer = styled.div``;

export const NavProtoItemContainer = styled.div`
  border-bottom: 1px solid rgba(151, 151, 151, 0.3);
  padding-bottom: 15px;
`;

export const NavProtoItemHeaderContainer = styled.div`
  align-items: center;
  display: flex;
  padding: 20px 10px 10px;
`;

export const NavProtoItemHeader = styled.h2`
  color: rgba(127, 128, 131, 1);
  font-size: 15px;
  font-family: var(--font-default-stack);
  font-weight: 400;
  height: 100%;
  letter-spacing: 0.7px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
`;

export const NavProtoItemHeaderIconContainer = styled.div`
  font-size: 13px;
  margin-left: auto;
`;

export const NavProtoItemHeaderIcon = styled.span`
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s ease-in-out;

  :hover {
    color: #fff;
  }
`;

export const NavProtoItemServicesList = styled.ul`
  list-style: none;
  margin: 0 10px;
  padding: 0;
`;

export const NavProtoItemServicesItem = styled.li`
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  opacity: 0.6;
  padding: 12px 10px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: rgba(151, 151, 151, 0.2);
    opacity: 0.9;
  }
`;
