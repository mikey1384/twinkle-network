import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router';
import Loading from 'components/Loading';
import loadable from 'loadable-components';
import Button from 'components/Button';
import Notification from 'components/Notification';
import WorkMenuItems from './WorkMenuItems';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import { connect } from 'react-redux';
import {
  openAddPlaylistModal,
  openAddVideoModal
} from 'redux/actions/VideoActions';
const Videos = loadable(() => import('./Videos'), {
  LoadingComponent: Loading
});
const Links = loadable(() => import('./Links'), {
  LoadingComponent: Loading
});
const Work = loadable(() => import('./Work'), {
  LoadingComponent: Loading
});

class WorkSection extends Component {
  static propTypes = {
    openAddVideoModal: PropTypes.func.isRequired,
    openAddPlaylistModal: PropTypes.func.isRequired
  };
  render() {
    const { openAddPlaylistModal, openAddVideoModal } = this.props;
    return (
      <div
        className={css`
          width: 100%;
          margin-top: 1rem;
          display: flex;
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 0;
            display: flex;
          }
        `}
      >
        <WorkMenuItems
          style={{
            height: 'CALC(100vh - 22rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '20rem',
            marginRight: '1rem',
            marginLeft: '1rem',
            position: 'fixed'
          }}
        />
        <div
          className={css`
            width: CALC(100vw - 51rem - 2rem);
            margin-left: 20rem;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              margin-top: 0;
              margin-left: 0;
              margin-right: 0;
            }
          `}
        >
          <Switch>
            <Route path="/videos" component={Videos} />
            <Route path="/links" component={Links} />
            <Route path="/work" component={Work} />
          </Switch>
        </div>
        <Notification
          className={css`
            width: 31rem;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            right: 1rem;
            top: 6rem;
            bottom: 0;
            position: absolute;
            @media (max-width: ${mobileMaxWidth}) {
              display: none;
            }
          `}
        >
          <Button
            snow
            style={{
              fontSize: '2rem',
              width: '99%',
              marginTop: '0.1rem',
              marginBottom: '1rem'
            }}
            onClick={openAddVideoModal}
          >
            + Add Video
          </Button>
          <Button
            snow
            style={{ fontSize: '2rem', width: '99%' }}
            onClick={openAddPlaylistModal}
          >
            + Add Playlist
          </Button>
        </Notification>
      </div>
    );
  }
}

export default connect(
  null,
  { openAddPlaylistModal, openAddVideoModal }
)(WorkSection);
