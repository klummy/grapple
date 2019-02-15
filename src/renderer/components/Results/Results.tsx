import Prism from 'prismjs';
import * as React from 'react';
import { connect } from 'react-redux';

import { IStoreState } from '../../types';
import { ITab } from '../../types/layout';

import { ResultContainer, ResultOuterContainer } from './Results.components';

import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism-twilight.css';

interface IResultsProps {
  activeTab: string;
  queryResult: string;
  tabs: ITab[];
}

const highlightResults = () => Prism.highlightAll();

class Results extends React.Component<IResultsProps, {}> {
  componentDidMount() {
    highlightResults();
  }

  componentDidUpdate(prevProps: IResultsProps) {
    if (prevProps.queryResult !== this.props.queryResult) {
      highlightResults();
    }
  }

  render() {
    const { queryResult } = this.props;

    return (
      <ResultOuterContainer>
        <ResultContainer
          className="line-numbers"
          id="gEditorContainer"
        >
          <code className="language-js">{queryResult}</code>
        </ResultContainer>
      </ResultOuterContainer>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  tabs: state.layout.tabs,
});

export default connect(mapStateToProps)(Results);
