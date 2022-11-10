import styled from '@emotion/styled';

import { Input } from '../GenericComponents';
import { IFieldProps } from '../QueryPane/shared';

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

export const TableRow = styled('tr')`
  align-items: center;
  border-bottom: ${(props: IFieldProps) => (props.isNested ? '' : tableBorder)};
  border-top: ${(props: IFieldProps) => (props.isNested ? '' : tableBorder)};
  display: flex;
  height: 50px;
  width: 100%;

  td:first-child {
    padding-right: 10px;
    text-align: right;
  }

  /* Select the next nested item that is not nested */
  &.nested + &:not(.nested),
  &.nested-head {
    border-top: ${tableBorder};
  }

  &.nested-head {
    border-bottom: none;
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
  width: calc(100% - 10px);
`;

export const TableCellWithIcon = styled(TableCell)`
  align-items: center;
  display: flex;
`;

export const QueryInputIcon = styled.span`
  cursor: pointer;
  padding: 0 10px;
`;
