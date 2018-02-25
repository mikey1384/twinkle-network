import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import createStoreWithHistory from './store'
import App from 'containers/App'
import { ScrollContext } from 'components/Wrappers/ReactRouterScroll'
import { Modal } from 'react-overlays'
import fontawesome from '@fortawesome/fontawesome'
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers'
import faBolt from '@fortawesome/fontawesome-free-solid/faBolt'
import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faFilm from '@fortawesome/fontawesome-free-solid/faFilm'
import faComment from '@fortawesome/fontawesome-free-solid/faComment'
import faBook from '@fortawesome/fontawesome-free-solid/faBook'
fontawesome.library.add(faUsers, faComment, faBolt, faBook, faFilm, faHome)

const history = createHistory()
const store = createStoreWithHistory(history)

Modal.prototype.componentWillMount = function() {
  this.focus = () => {}
}

ReactDOM.hydrate(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ScrollContext>
        <Route component={App} />
      </ScrollContext>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('react-view')
)
