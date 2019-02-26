import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ITab } from '@/renderer/types/layout';
import { IStoreState } from '@/renderer/types';

import {
  TableHead, TableRow,
  QueryParamTable, TableTh, TableBody, QueryInput, QueryInputIcon, TableCellWithIcon,
} from '../../QueryParamBuilder/QueryParamBuilder.components';
import { IQueryTabItemProps, QueryTabItemWrapper } from './shared';

import cuid = require('cuid');

interface IMetadataTabProps extends IQueryTabItemProps {
  activeTab: string,
  currentTab: ITab
}

// Simple key value pair interface, used here for row
export interface IKeyValue {
  id: string,
  key: string,
  value: string
}

const newKeyValuePair = (): IKeyValue => ({
  id: cuid(),
  key: '',
  value: '',
});

const MetadataTab: React.SFC<IMetadataTabProps> = ({
  activeTab, currentTab, visible,
}) => {
  const [rows, setRows] = useState<IKeyValue[]>([newKeyValuePair()]);

  // Load previously saved metadata
  useEffect(() => {
    const savedRowsObj = activeTab && currentTab && currentTab.metadata;
    if (savedRowsObj) {
      const savedRows = Object.keys(savedRowsObj)
        .map(key => ({
          id: cuid(),
          key,
          value: savedRowsObj[key],
        }));

      setRows([...savedRows, newKeyValuePair()]);
    }
  }, [activeTab]);

  // Add a new tab item if it's the last item and the input isn't empty.
  const addNewRows = (event: React.ChangeEvent<HTMLInputElement>, row: IKeyValue) => {
    if (event.target.value && (rows.indexOf(row) === (rows.length - 1))) {
      setRows([...rows, newKeyValuePair()]);
    }
  };

  return (
    <QueryTabItemWrapper
      id="queryMeta"
      visible={visible}
    >
      <QueryParamTable>
        <TableHead>
          <TableRow>
            <TableTh>Item</TableTh>
            <TableTh>Value</TableTh>
          </TableRow>
        </TableHead>

        <TableBody>
          {
            rows.map(row => (
              <TableRow
                data-meta-tab-row
                key={row.id}
              >
                <TableCellWithIcon>
                  {/* TODO: Style better;
                  Also, reduce opacity or similar transition to show disabled rows */}
                  <input
                    data-enabled
                    defaultChecked
                    name="enabled"
                    type="checkbox"
                  />

                  <QueryInput
                    data-key
                    defaultValue={row.key}
                    style={{
                      marginRight: '10px',
                    }}
                    type="text"
                  />
                </TableCellWithIcon>

                <TableCellWithIcon>
                  <QueryInput
                    data-value
                    defaultValue={row.value}
                    onChange={event => addNewRows(event, row)}
                    onFocus={event => addNewRows(event, row)}
                    type="text"
                  />

                  {
                    rows.length > 1 && (
                      <QueryInputIcon
                        className="ti-trash"
                        onClick={() => {
                          setRows(rows.filter(item => row.id !== item.id));
                        }}
                        title="Delete row"
                      />
                    )
                  }
                </TableCellWithIcon>
              </TableRow>

            ))
          }

        </TableBody>
      </QueryParamTable>
    </QueryTabItemWrapper>
  );
};

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  currentTab:
    state.layout.tabs.find(tab => tab.id === state.layout.activeTab) || {},
  tabs: state.layout.tabs,
});

export default connect(mapStateToProps)(MetadataTab);
