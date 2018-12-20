import * as React from 'react';
import ReactDOM from 'react-dom';

import Layout from './components/Layout';

const App = () => (
  <Layout>
    <h1>Yellow</h1>
  </Layout>
)

ReactDOM.render(<App />, document.getElementById('root'))