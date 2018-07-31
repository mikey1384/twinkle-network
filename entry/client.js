import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import createStoreWithHistory from './store'
import App from 'containers/App'
import fontawesome from '@fortawesome/fontawesome'
import faAlignJustify from '@fortawesome/fontawesome-free-solid/faAlignJustify'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'
import faBolt from '@fortawesome/fontawesome-free-solid/faBolt'
import faBook from '@fortawesome/fontawesome-free-solid/faBook'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown'
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft'
import faChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight'
import faComment from '@fortawesome/fontawesome-free-solid/faComment'
import faCommentAlt from '@fortawesome/fontawesome-free-solid/faCommentAlt'
import faComments from '@fortawesome/fontawesome-free-solid/faComments'
import faFilm from '@fortawesome/fontawesome-free-solid/faFilm'
import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'
import faThumbsUp from '@fortawesome/fontawesome-free-solid/faThumbsUp'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers'
fontawesome.library.add(
  faAlignJustify,
  faBars,
  faBolt,
  faBook,
  faCaretDown,
  faChevronLeft,
  faChevronRight,
  faComment,
  faCommentAlt,
  faComments,
  faFilm,
  faHome,
  faPencilAlt,
  faSearch,
  faSpinner,
  faStar,
  faThumbsUp,
  faTimes,
  faTrashAlt,
  faUser,
  faUsers
)

const history = createHistory()
const store = createStoreWithHistory(history)

ReactDOM.hydrate(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route component={App} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('react-view')
)
