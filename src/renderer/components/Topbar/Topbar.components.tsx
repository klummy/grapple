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
  flex-shrink: 0;
  padding: 0 15px 0 25px;
  width: 300px;

  svg {
    margin-right: 15px;
  }
`;
