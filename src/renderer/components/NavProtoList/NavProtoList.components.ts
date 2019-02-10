import styled from "styled-components";

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
  color: inherit;
  font-size: 15px;
  font-weight: 400;
  height: 100%;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NavProtoItemHeaderIcon = styled.span`
  margin-left: auto;
`;

export const NavProtoItemServicesList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavProtoItemServicesItem = styled.li`
  cursor: pointer;
  font-size: 13px;
  opacity: 0.7;
  padding: 10px 20px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: rgba(151, 151, 151, 0.2);
    opacity: 0.9;
  }
`;
