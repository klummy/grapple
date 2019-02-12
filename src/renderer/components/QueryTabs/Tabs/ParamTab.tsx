import React, { Fragment } from 'react';

import QueryParamBuilder from '../../QueryPane/QueryParamBuilder';
import { ICustomFields } from '../../../services/grpc';

export interface IParamTabProps {
  requestFields?: ICustomFields[]
}

const ParamTab: React.SFC<IParamTabProps> = ({ requestFields }) => {
  return (
    <Fragment>
      {requestFields && <QueryParamBuilder fields={requestFields} />}
    </Fragment>

  );
};

export default ParamTab;
