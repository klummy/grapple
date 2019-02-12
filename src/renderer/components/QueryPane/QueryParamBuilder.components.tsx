import styled from 'styled-components';

import { Input } from '../GenericComponents';
import { IFieldProps } from './shared';

const tableBorder = '1px solid var(--color-lines-default)';

export const QueryParamTable = styled.table`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  height: auto;
  margin: 0;
  overflow-y: auto;
  padding: 0;
  width: 100%;

  select {
    border: none;
  }

  tr + tr,
  tbody tr:first-child {
    border-top: none;
  }

  td:first-child,
  th:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
  }

  td:first-child {
    border-right: ${tableBorder};
  }

  td:last-child,
  th:last-child {
    flex: 1;
  }
`;

export const TableHead = styled.thead`
  width: 100%;

  tr {
    border-top: none;

    th:first-child {
      border-right: ${tableBorder};
    }

    th:last-child {
      padding-left: 10px;
    }
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  align-items: center;
  border-bottom: ${tableBorder};
  border-top: ${tableBorder};
  display: flex;
  height: 50px;
  width: 100%;

  td:first-child {
    padding-left: ${(props: IFieldProps) => props.isNested && '15px'};
  }
`;

export const TableTh = styled.th`
  font-size: 13px;
  font-family: var(--font-alternate-stack);
  opacity: 0.8;
  text-align: left;
  text-transform: capitalize;

  &:first-child {
    width: 200px;
  }

  &:last-child {
    flex: 1;
  }
`;

export const TableCell = styled.td`
  font-size: 13px;
  opacity: 0.7;
  text-transform: capitalize;
`;

export const QueryInput = styled(Input)`
  border: none;
  border-radius: 3px;
  margin-left: 10px;
  width: 100%;
`;
