import * as React from 'react';
import styled from 'styled-components'

import { ICustomFields as ICustomField } from '../../services/grpc';
import { grpcTypes } from '../../services/grpc-constants';
import {
  Form,
  Input,
  InputGroup,
  Select
} from '../GenericComponents';

const QueryParamContainerForm = styled(Form)`
  flex-direction: column;
  padding: 20px 0;
`

class QueryParamBuilder extends React.Component<{
  fields: Array<ICustomField>
}, {}> {
  renderInput(field: ICustomField) {
    const { defaultValue, type, values } = field

    switch (type) {
      case grpcTypes.string:
        return (
          <Input type='text' defaultValue={ defaultValue } />
        )

      case grpcTypes.enum:
        if (!values) {
          return <span>No values found for enum type</span>
        }

        const valueKeys = Object.keys(values)

        return (
          <Select>
            {
              valueKeys.map(key => {
                const text = values[key]

                return (
                  <option value={ key } key={ key }>
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

  renderField(field: ICustomField) {
    const { nested } = field
    if (Array.isArray(nested) && nested.length > 0) {
      return (
        <React.Fragment key={ field.id }>
          {
            nested.map(item => this.renderField(item))
          }
        </React.Fragment>
      )
    }

    return (
      <InputGroup key={ field.id }>
        <label>{ field.name }</label>
        { this.renderInput(field) }
      </InputGroup>
    )
  }

  render() {
    const fields = this.props.fields.sort((a, b) => {
      const aName = a.name || ''
      const bName = b.name || ''

      return aName.localeCompare(bName, 'en', {
        sensitivity: 'base'
      })
    })

    return (
      <QueryParamContainerForm>
        {
          Object.keys(fields).map(key => this.renderField(fields[key]))
        }
      </QueryParamContainerForm>
    );
  }
}

export default QueryParamBuilder;