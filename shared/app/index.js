import React, { PropTypes } from 'react';
import Header from 'containers/Header';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import { getVideos } from 'actions/VideoActions';
import { getPinnedPlaylists, getPlaylists } from 'actions/PlaylistActions';
import { initSession } from 'actions/UserActions';


export default class App extends React.Component {
  static needs = [
    initSession,
    getVideos,
    getPinnedPlaylists,
    getPlaylists
  ];

  render() {
    return (
      <div id="main-view">
        <Header />
        {this.props.children}
        <footer
          className="footer col-md-12"
          style={{
            marginTop: '1em'
          }}
        >
          <p className="text-muted text-center">Twinkle © 2016</p>
        </footer>
      </div>
    );
  }
}
