import * as monaco from 'monaco-editor';
import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'

import { IStoreState } from '../../types';
import { ITab } from '../../types/layout';

const ResultOuterContainer = styled.div`
  padding: 0 20px 10px;
`

const ResultContainer = styled.div`
  background-color: #fff;
  height: 500px;
  overflow-y: auto;
`

interface IResultsProps {
  activeTab: string
  queryResult: string
  tabs: Array<ITab>
}

interface IResultsState {
  editor?: monaco.editor.IStandaloneCodeEditor
}

class Results extends React.Component<IResultsProps, IResultsState> {
  updateEditorValue() {
    const editor = this.state.editor

    if (editor) {
      editor.setValue(this.props.queryResult)
    }
  }

  componentDidUpdate(prevProps: IResultsProps) {
    if (prevProps.queryResult !== this.props.queryResult) {
      this.updateEditorValue()
    }
  }

  componentDidMount() {
    const editorContainer = document.getElementById('gEditorContainer')

    if (editorContainer) {
      const editor = monaco.editor.create(editorContainer, {
        language: 'json',
        readOnly: true,
        theme: 'vs-dark',
        value: this.props.queryResult
      })

      this.setState({
        editor
      })
    }
  }

  render() {
    return (
      <ResultOuterContainer>
        <ResultContainer id="gEditorContainer" />
      </ResultOuterContainer>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  tabs: state.layout.tabs,
})

export default connect(mapStateToProps)(Results);