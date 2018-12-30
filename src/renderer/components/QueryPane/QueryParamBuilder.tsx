import * as React from 'react';
import styled from 'styled-components'

import { ICustomFields as ICustomField } from '../../services/grpc';
import { grpcTypes } from '../../services/grpc-constants';
import {
  Input,
  Select
} from '../GenericComponents';

const tableBorder = '1px solid rgba(239, 233, 244, 1)'

const QueryParamTable = styled.table`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  max-height: 300px;
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

  td, th {
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
`

const TableHead = styled.thead`
  flex: 1;
  width: 100%;

  tr {
    background-color: #eee;
  }
`

const TableBody = styled.tbody`
  flex: 1;
`


const TableRow = styled.tr`
  align-items: center;
  border-bottom: ${tableBorder};
  border-top: ${tableBorder};
  display: flex;
  height: 40px;
  width: 100%;

  td:first-child {
    padding-left: ${(props: IFieldProps) => props.isNested && '30px'};
  }
`

const TableTh = styled.th`
  text-align: left;
  text-transform: capitalize;

  &:first-child {
    width: 200px;
  }

  &:last-child {
    flex: 1;
  }
`

const TableCell = styled.td`
  text-transform: capitalize;
`

const QueryInput = styled(Input)`
  border: none;
  padding-left: 0;
  padding-right: 0;
  width: 100%;
`

interface IFieldProps {
  isNested?: boolean
}

class QueryParamBuilder extends React.Component<{
  fields: Array<ICustomField>
}, {}> {
  renderInput(field: ICustomField) {
    const { defaultValue, fullName, name, type, values } = field

    switch (type) {
      case grpcTypes.string:
      case grpcTypes.int32:
      case grpcTypes.number:
        return (
          <QueryInput type={ type } defaultValue={ defaultValue } name={ `${fullName}-${name}` } />
        )

      case grpcTypes.enum:
        if (!values) {
          return <span>No values found for enum type</span>
        }

        const valueKeys = Object.keys(values).sort((a, b) => {
          const aName = values[a] || ''
          const bName = values[b] || ''

          return aName.localeCompare(bName, 'en', {
            sensitivity: 'base'
          })
        })

        return (
          <Select name={ `${fullName}-${name}` }>
            {
              valueKeys.map(key => {
                const text = values[key]

                return (
                  <option value={ key } key={ key } defaultValue={ defaultValue }>
                    { text.substring(0, 1) }
                    { text.substring(1, text.length).toLowerCase() }
                  </option>
                )
              }
              )
            }
          </Select>
        )

      default:
        return (
          <span>Unable to automatically create param type for { type }</span>
        )
    }
  }

  renderField(field: ICustomField, fieldProps?: IFieldProps) {
    const { nested } = field
    if (Array.isArray(nested) && nested.length > 0) {
      return (
        <React.Fragment key={ field.id }>
          <TableRow>
            <TableTh>
              { field.name }
            </TableTh>
          </TableRow>

          {
            nested.map(item => this.renderField(item, { isNested: true }))
          }
        </React.Fragment>
      )
    }

    const isNested = fieldProps && fieldProps.isNested

    return (
      <TableRow key={ field.id } isNested={ isNested }>
        <TableCell>
          { field.name }
        </TableCell>

        <TableCell>
          { this.renderInput(field) }
        </TableCell>
      </TableRow>
    )
  }

  render() {
    const fields = this.props.fields
      .sort((a, b) => {
        const aName = a.name || ''
        const bName = b.name || ''

        return aName.localeCompare(bName, 'en', {
          sensitivity: 'base'
        })
      })

    return (
      <QueryParamTable>

        <TableHead>
          <TableRow>
            <TableTh>Key</TableTh>
            <TableTh>Value</TableTh>
          </TableRow>
        </TableHead>

        <TableBody>
          {
            Object.keys(fields).map(key => this.renderField(fields[key]))
          }
        </TableBody>

      </QueryParamTable>
    );
  }
}

export default QueryParamBuilder;