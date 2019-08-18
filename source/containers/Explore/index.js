import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router';
import Loading from 'components/Loading';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Featured from './Featured';
import Notification from 'components/Notification';
import WorkMenuItems from './WorkMenuItems';
import SearchPage from './SearchPage';
import { NavLink } from 'react-router-dom';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { connect } from 'react-redux';
import {
  openAddPlaylistModal,
  openAddVideoModal
} from 'redux/actions/VideoActions';
const Videos = React.lazy(() => import('./Videos'));
const Links = React.lazy(() => import('./Links'));

Explore.propTypes = {
  location: PropTypes.object.isRequired,
  mobileNavbarShown: PropTypes.bool.isRequired,
  openAddVideoModal: PropTypes.func.isRequired,
  openAddPlaylistModal: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  userId: PropTypes.number
};

function Explore({
  location,
  mobileNavbarShown,
  openAddPlaylistModal,
  openAddVideoModal,
  searchText,
  userId
}) {
  return (
    <ErrorBoundary>
      <div
        className={css`
          width: 100%;
          display: flex;
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 0;
          }
        `}
      >
        <WorkMenuItems
          className={css`
            top: CALC(50vh - 11rem);
            height: auto;
            width: 19rem;
            display: flex;
            position: fixed;
            justify-content: center;
            flex-direction: column;
            font-size: 2rem;
            font-family: sans-serif, Arial, Helvetica;
            > a {
              padding: 1.5rem;
              cursor: pointer;
              display: flex;
              align-items: center;
              text-align: center;
              width: 100%;
              justify-content: center;
              color: ${Color.gray()};
              text-decoration: none;
            }
            > a:hover {
              font-weight: bold;
              color: ${Color.black()};
            }
            > a.active {
              font-weight: bold;
              color: ${Color.black()};
              background: #fff;
            }
            @media (max-width: ${mobileMaxWidth}) {
              display: none;
            }
          `}
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
          <SearchPage
            searchText={searchText}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              marginBottom: '8rem'
            }}
          />
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/videos" component={Videos} />
              <Route path="/links" component={Links} />
              <Route path="/featured" component={Featured} />
            </Switch>
          </Suspense>
          <div
            className={css`
              display: none;
              @media (max-width: ${mobileMaxWidth}) {
                display: block;
                width: 100%;
                height: 5rem;
              }
            `}
          />
        </div>
        <Notification
          className={css`
            width: 31rem;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            right: 1rem;
            top: 5rem;
            bottom: 0;
            position: absolute;
            @media (max-width: ${mobileMaxWidth}) {
              display: none;
            }
          `}
          location={location.pathname.substring(1)}
        >
          {location.pathname === '/videos' && userId && (
            <>
              <Button
                skeuomorphic
                color="darkerGray"
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
                skeuomorphic
                color="darkerGray"
                style={{
                  fontSize: '2rem',
                  width: '99%',
                  marginBottom: '1rem'
                }}
                onClick={openAddPlaylistModal}
              >
                + Add Playlist
              </Button>
            </>
          )}
        </Notification>
      </div>
      <div
        style={{ display: mobileNavbarShown ? '' : 'none' }}
        className={css`
          display: none;
          > a {
            color: ${Color.gray()};
            &:hover {
              color: ${Color.gray()};
            }
          }
          > a.active {
            color: ${Color.black()};
            &:hover {
              color: ${Color.black()};
            }
          }
          @media (max-width: ${mobileMaxWidth}) {
            display: flex;
            z-index: 5;
            position: fixed;
            bottom: 9rem;
            justify-content: space-around;
            align-items: center;
            font-size: 3rem;
            width: 100%;
            height: 5rem;
            background: #fff;
          }
        `}
      >
        <NavLink to="/featured" activeClassName="active">
          <Icon icon="bolt" />
        </NavLink>
        <NavLink to="/videos" activeClassName="active">
          <Icon icon="film" />
        </NavLink>
        <NavLink to="/links" activeClassName="active">
          <Icon icon="book" />
        </NavLink>
      </div>
    </ErrorBoundary>
  );
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    mobileNavbarShown: state.ViewReducer.mobileNavbarShown,
    searchText: state.SearchReducer.searchText
  }),
  { openAddPlaylistModal, openAddVideoModal }
)(Explore);
