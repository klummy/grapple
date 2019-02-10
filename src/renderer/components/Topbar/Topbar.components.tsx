import styled from "styled-components";

export const TopbarContainer = styled.div`
  background-color: var(--color-black-default);
  color: #76787b;
  display: flex;
  height: 60px;
`;

export const LogoContainer = styled.div`
  align-items: center;
  border-right: 1px solid var(--color-lines-default);
  display: flex;
  padding: 0 15px 0 25px;
  width: 300px;

  svg {
    margin-right: 15px;
  }
`;

export const SearchInput = styled.input`
  background-color: #1f2228;
  border: none;
  border-radius: 50px;
  color: var(--text-color-default);
  font-size: 12px;
  height: 32px;
  padding: 0 10px;
  transition: all 0.3s ease-in-out;
  width: 100%;

  &:focus {
    border: 1px solid var(--color-lines-default);
    outline: none;
  }
`;
