import { h } from 'preact';
import { Route, Router, RouterOnChangeArgs } from 'preact-router';
import { useState, StateUpdater } from 'preact/hooks';

import Home from '~/routes/home/home';

if (module.hot) {
  require("preact/debug")
}

const handleRouteChange = (event: RouterOnChangeArgs, updateUrl: StateUpdater<string>) => {

}

const App = () => {
  const [currentUrl, setCurrentUrl] = useState('')

  return (
    <div id="app">
      <Router onChange={event => handleRouteChange(event, setCurrentUrl)}>
        <Route path="/" component={Home} />
      </Router>
    </div>
  )
}
export default App