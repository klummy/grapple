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

import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism-twilight.css';

interface IResultsProps {
  meta?: ITabMeta,
  queryResult: string;
}

const highlightResults = () => Prism.highlightAll();

const Results: React.SFC<IResultsProps> = ({ meta, queryResult }) => {
  useEffect(() => {
    highlightResults();
  });

  const timestamp = (meta && meta.timestamp) || 0;
  const status = (meta && meta.status) || '';

  return (
    <ResultWrapper>
      <ResultMetaContainer>
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
        </ResultContainer>
      </ResultOuterContainer>
    </ResultWrapper>
  );
};

export default Results;
