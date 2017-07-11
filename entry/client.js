import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Route} from 'react-router-dom'
import {ConnectedRouter} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import createStoreWithHistory from './store'
import App from 'containers/App'
import {ScrollContext} from 'components/Wrappers/ReactRouterScroll'

const history = createHistory()
const store = createStoreWithHistory(history)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ScrollContext>
        <Route component={App} />
      </ScrollContext>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('react-view')
)
