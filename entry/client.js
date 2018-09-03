import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import createStoreWithHistory from './store';
import App from 'containers/App';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons/faAlignJustify';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons/faCommentAlt';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faFilm } from '@fortawesome/free-solid-svg-icons/faFilm';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons/faThumbsUp';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
library.add(
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
);

const history = createHistory();
const store = createStoreWithHistory(history);

ReactDOM.hydrate(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route component={App} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('react-view')
);
