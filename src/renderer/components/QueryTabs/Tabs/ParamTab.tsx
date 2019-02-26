import React from 'react';

import QueryParamBuilder from '../../QueryParamBuilder/QueryParamBuilder';
import { ICustomFields } from '../../../services/grpc';
import { IQueryTabItemProps, QueryTabItemWrapper } from './shared';

export interface IParamTabProps extends IQueryTabItemProps {
  requestFields?: ICustomFields[]
}

const ParamTab: React.SFC<IParamTabProps> = ({ requestFields, visible }) => {
  return (
    <QueryTabItemWrapper visible={visible}>
      {requestFields && <QueryParamBuilder fields={requestFields} />}
    </QueryTabItemWrapper>

  );
};

export default ParamTab;
