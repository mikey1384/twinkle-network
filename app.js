import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import createStoreWithMiddlewares from './store';
import App from 'containers/App';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAlignJustify } from '@fortawesome/pro-solid-svg-icons/faAlignJustify';
import { faBars } from '@fortawesome/pro-solid-svg-icons/faBars';
import { faBolt } from '@fortawesome/pro-solid-svg-icons/faBolt';
import { faBook } from '@fortawesome/pro-solid-svg-icons/faBook';
import { faCameraAlt } from '@fortawesome/pro-solid-svg-icons/faCameraAlt';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons/faCaretDown';
import { faCertificate } from '@fortawesome/pro-solid-svg-icons/faCertificate';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons/faCheckCircle';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight';
import { faComment } from '@fortawesome/pro-solid-svg-icons/faComment';
import { faCommentAlt } from '@fortawesome/pro-solid-svg-icons/faCommentAlt';
import { faComments } from '@fortawesome/pro-solid-svg-icons/faComments';
import { faFilm } from '@fortawesome/pro-solid-svg-icons/faFilm';
import { faLink } from '@fortawesome/pro-solid-svg-icons/faLink';
import { faHome } from '@fortawesome/pro-solid-svg-icons/faHome';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { faPencilAlt } from '@fortawesome/pro-solid-svg-icons/faPencilAlt';
import { faSearch } from '@fortawesome/pro-solid-svg-icons/faSearch';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons/faSpinner';
import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar';
import { faStarHalfAlt } from '@fortawesome/pro-solid-svg-icons/faStarHalfAlt';
import { faStar as farStar } from '@fortawesome/pro-regular-svg-icons/faStar';
import { faStarHalfAlt as farStarHalfAlt } from '@fortawesome/pro-regular-svg-icons/faStarHalfAlt';
import { faThumbsUp } from '@fortawesome/pro-solid-svg-icons/faThumbsUp';
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes';
import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons/faTrashAlt';
import { faTree } from '@fortawesome/pro-solid-svg-icons/faTree';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faUsers } from '@fortawesome/pro-solid-svg-icons/faUsers';
library.add(
  faAlignJustify,
  faBars,
  faBolt,
  faBook,
  faCameraAlt,
  faCaretDown,
  faCertificate,
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faComment,
  faCommentAlt,
  faComments,
  faFilm,
  faHome,
  faLink,
  faLock,
  faPencilAlt,
  faSearch,
  faSpinner,
  faStar,
  faStarHalfAlt,
  farStar,
  farStarHalfAlt,
  faThumbsUp,
  faTimes,
  faTrashAlt,
  faTree,
  faUser,
  faUsers
);

const store = createStoreWithMiddlewares();
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('react-view')
);
