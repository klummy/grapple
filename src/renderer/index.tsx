import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import Layout from './components/Layout';
import store from './store';
import './styles/global.css';
import './styles/normalize.css';

class App extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={ store }>
        <Layout>
          <h1>Yellow</h1>
        </Layout>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'))