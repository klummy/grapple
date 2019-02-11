import Prism from "prismjs";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { IStoreState } from "../../types";
import { ITab } from "../../types/layout";

import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/themes/prism-twilight.css";

const ResultOuterContainer = styled.div`
  background-color: var(--color-black-default);
  margin-right: 10px;
  margin-top: 10px;
  padding: 10px;
  height: calc(100vh - 80px);
  flex: 1;
`;

const ResultContainer = styled.pre`
  background-color: #fff;
  border: none !important;
  border-radius: 0 !important;
  font-size: 12px;
  height: 100%;
  overflow-y: auto;
  margin: 0 !important;
`;

interface IResultsProps {
  activeTab: string;
  queryResult: string;
  tabs: Array<ITab>;
}

interface IResultsState {
  highlightedMarkup: string;
}

class Results extends React.Component<IResultsProps, IResultsState> {
  state = {
    highlightedMarkup: ""
  };

  componentDidUpdate(prevProps: IResultsProps) {
    if (prevProps.queryResult !== this.props.queryResult) {
      this.highlightResults();
    }
  }

  highlightResults() {
    Prism.highlightAll();
  }

  componentDidMount() {
    this.highlightResults();
  }

  render() {
    const { queryResult } = this.props;

    return (
      <ResultOuterContainer>
        <ResultContainer id="gEditorContainer" className="line-numbers">
          <code className="language-js">{queryResult}</code>
        </ResultContainer>
      </ResultOuterContainer>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  tabs: state.layout.tabs
});

export default connect(mapStateToProps)(Results);
