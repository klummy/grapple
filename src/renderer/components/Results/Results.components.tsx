import styled from 'styled-components';

export const ResultOuterContainer = styled.div`
  background-color: var(--color-black-default);
  margin-right: 10px;
  margin-top: 10px;
  padding: 10px;
  height: calc(100vh - 80px);
  flex: 1;
`;

/* "!important" is required to override generated styles which have a higher specificity */
export const ResultContainer = styled.pre`
  background-color: #fff;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  font-size: 12px;
  height: 100%;
  overflow-y: auto;
  margin: 0 !important;
`;
