import styled from 'styled-components';

import { ITabStatus } from '../../types/layout';

export const ResultWrapper = styled.div`
  flex: 1;
  flex-direction: column;
`;

export const ResultOuterContainer = styled.div`
  background-color: var(--color-black-default);
  margin-right: 10px;
  margin-top: 10px;
  padding: 10px;
  height: calc(100vh - 140px);
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

export const ResultMetaContainer = styled.div`
  align-items: center;
  background-color: var(--color-black-default);
  display: flex;
  font-size: 13px;
  height: 52px;
  margin: 10px 10px 10px 0;
  padding: 10px;
`;

export const ResultStatus = styled.span<{ status: ITabStatus }>`
  color: ${props => (props.status === ITabStatus.error ? 'red' : 'green')};
  display: inline-block;
  margin-left: auto;
  margin-right: 10px;
  text-transform: capitalize;
`;

export const ResultTimestamp = styled.span`
`;
