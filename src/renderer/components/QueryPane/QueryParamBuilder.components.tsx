import styled from "styled-components";

import { Input } from "../GenericComponents";
import { IFieldProps } from "./shared";

const tableBorder = "1px solid rgba(239, 233, 244, 1)";

export const QueryParamTable = styled.table`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 300px;
  margin: 20px 0;
  overflow-y: auto;
  padding: 0;
  width: 50%;

  select {
    border: none;
  }

  tr + tr,
  tbody tr:first-child {
    border-top: none;
  }

  td,
  th {
    padding-left: 10px;
    padding-right: 10px;
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
    background-color: #eee;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  align-items: center;
  border-bottom: ${tableBorder};
  border-top: ${tableBorder};
  display: flex;
  height: 40px;
  width: 100%;

  td:first-child {
    padding-left: ${(props: IFieldProps) => props.isNested && "30px"};
  }
`;

export const TableTh = styled.th`
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
  text-transform: capitalize;
`;

export const QueryInput = styled(Input)`
  border: none;
  padding-left: 0;
  padding-right: 0;
  width: 100%;
`;
