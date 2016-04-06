import React, { PropTypes } from 'react';
import Header from 'containers/Header';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import { getVideos } from 'actions/VideoActions';
import { getPinnedPlaylists, getPlaylists } from 'actions/PlaylistActions';
import * as UserActions from 'actions/UserActions';


class App extends React.Component {
  static needs = [
    UserActions.initSession,
    getVideos,
    getPinnedPlaylists,
    getPlaylists
  ];
  
  render() {
    return (
      <div id="main-view">
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default App;
