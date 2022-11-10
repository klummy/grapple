import * as React from 'react';
import omit from 'lodash.omit';
import { ICustomFields as ICustomField } from '../../services/grpc';
import { grpcTypes } from '../../services/grpc-constants';
import { Select } from '../GenericComponents';
import { ITab } from '../../types/layout';
import {
  QueryInput,
  QueryParamTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableTh,
} from './QueryParamBuilder.components';
import { IFieldProps } from '../QueryPane/shared';

class QueryParamBuilder extends React.Component<
  {
    currentTab?: ITab;
    fields: ICustomField[];
  },
  {}> {
  renderInput(field: ICustomField, parentName: string | undefined) {
    const {
      defaultValue, fullName, name, type, values,
    } = field;
    const { currentTab } = this.props;

    const inputName = parentName ? `${parentName}/${name}` : name;


    const storedQueryData = (currentTab && currentTab.queryData) || {};

    const defaultInputValue = defaultValue
      || (parentName
        ? storedQueryData[parentName] && storedQueryData[parentName][name]
        : storedQueryData[name]);

    const sharedProps = {
      'data-field-name': fullName,
      'data-parent-name': parentName,
      'data-query-item': true,
      defaultValue: defaultInputValue,
      name: inputName,
      type,
    };

    switch (type) {
      case grpcTypes.string:
      case grpcTypes.int32:
      case grpcTypes.number:
        return (
          <QueryInput
            {...sharedProps}
          />
        );

      case grpcTypes.bool: {
        const itemProps = omit(sharedProps, ['type']);

        return (
          <QueryInput
            type="checkbox"
            {...itemProps}
          />
        );
      }

      case grpcTypes.enum: {
        if (!values) {
          return <span>No values found for enum type</span>;
        }

        const valueKeys = Object.keys(values).sort((a, b) => {
          const aName = values[a] || '';
          const bName = values[b] || '';

          return aName.localeCompare(bName, 'en', {
            sensitivity: 'base',
          });
        });

        return (
          <Select
            {...sharedProps}
          >
            {valueKeys.map((key) => {
              const text = values[key];

              return (
                <option
                  defaultValue={defaultInputValue}
                  key={key}
                  value={key}
                >
                  {text.substring(0, 1).toUpperCase()}
                  {text.substring(1, text.length).toLowerCase()}
                </option>
              );
            })}
          </Select>
        );
      }

      default:
        return (
          <span>Unable to automatically create param type for {type}</span>
        );
    }
  }

  renderField(field: ICustomField, fieldProps?: IFieldProps) {
    const { nested } = field;
    const isNested = fieldProps && fieldProps.isNested;

    if (Array.isArray(nested) && nested.length > 0) {
      return (
        <React.Fragment key={field.id}>
          <TableRow
            className="nested-head"
            isNested={isNested}
          >
            <TableTh>{field.name}</TableTh>
          </TableRow>

          {nested.map(item => this.renderField(item, {
            isNested: true,
            parentName: field.name,
          }))}
        </React.Fragment>
      );
    }

    const parentName = fieldProps && fieldProps.parentName;

    return (
      <TableRow
        className={isNested ? 'nested' : ''}
        isNested={isNested}
        key={field.id}
      >
        <TableCell>{field.name}</TableCell>

        <TableCell>{this.renderInput(field, parentName)}</TableCell>
      </TableRow>
    );
  }

  render() {
    const fields = this.props.fields.sort((a, b) => {
      const aName = a.name || '';
      const bName = b.name || '';

      return aName.localeCompare(bName, 'en', {
        sensitivity: 'base',
      });
    });

    return (
      <QueryParamTable id="queryParams">
        <TableHead>
          <TableRow>
            <TableTh>Key</TableTh>
            <TableTh>Value</TableTh>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.keys(fields).map(key => this.renderField(fields[key]))}
        </TableBody>
      </QueryParamTable>
    );
  }
}

export default QueryParamBuilder;
