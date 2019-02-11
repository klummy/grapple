import styled from "styled-components";
export const EmptyStateContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  min-height: 400px;
  padding: 20px;
`;

export const OuterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  max-width: calc(100vw - 300px);
  overflow-y: auto;
`;
