import Prism from 'prismjs';
import React, { Fragment, useEffect } from 'react';

import {
  ResultContainer,
  ResultMetaContainer,
  ResultOuterContainer,
  ResultStatus,
  ResultTimestamp,
  ResultWrapper,
} from './Results.components';
import { ITabMeta } from '@/renderer/types/layout';
import Loader from '../Icons/loader';
import { grpcStatus } from '../../services/grpc-constants';

import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism-twilight.css';

interface IResultsProps {
  inProgress: boolean | undefined,
  meta?: ITabMeta,
  queryResult: string;
}

const highlightResults = () => Prism.highlightAll();

const Results: React.SFC<IResultsProps> = ({ inProgress, meta, queryResult }) => {
  useEffect(() => {
    highlightResults();
  });

  const errorCode = (meta && meta.code && grpcStatus[`${meta.code}`]) || '';
  const timestamp = (meta && meta.timestamp) || 0;
  const status = (meta && meta.status) || '';

  return (
    <ResultWrapper>
      <ResultMetaContainer>
        {
          errorCode
          && (
            <Fragment>
              <span>Status: {errorCode}</span>
            </Fragment>
          )
        }
        {
          status
          && (
            <Fragment>
              <ResultStatus status={status}>{status}</ResultStatus>
            </Fragment>
          )
        }
        {
          timestamp !== 0
          && (
            <Fragment>
              <ResultTimestamp>{timestamp.toFixed(2)}ms</ResultTimestamp>
            </Fragment>
          )
        }
      </ResultMetaContainer>
      <ResultOuterContainer data-testid="results">
        <ResultContainer
          className="line-numbers"
          id="gEditorContainer"
        >
          <code className="language-js">{queryResult}</code>
          <Loader show={inProgress as boolean} />

        </ResultContainer>
      </ResultOuterContainer>
    </ResultWrapper>
  );
};

export default Results;
