import styled from '@emotion/styled';

export const QueryPanEmptyStateContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  min-height: 400px;
  padding: 20px;
`;

export const QueryPaneContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  margin: 10px 10px 10px 20px;
  overflow-y: auto;
  width: 48%;
`;

export const ParamBuilderContainer = styled.div`
  background-color: var(--color-black-default);
  flex: 1;
  margin-top: 10px;
  padding: 10px;
`;
