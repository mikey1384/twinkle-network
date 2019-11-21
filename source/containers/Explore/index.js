import React, { Suspense, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import Subjects from './Subjects';
import Notification from 'components/Notification';
import MenuItems from './MenuItems';
import Search from './Search';
import Categories from './Categories';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { socket } from 'constants/io';
import { getSectionFromPathname } from 'helpers';
import { useExploreContext } from 'contexts';
import { useScrollToBottom } from 'helpers/hooks';
const Videos = React.lazy(() => import('./Videos'));
const Links = React.lazy(() => import('./Links'));

Explore.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default function Explore({ history, location }) {
  const {
    actions: { onClearLinksLoaded, onClearVideosLoaded, onReloadSubjects }
  } = useExploreContext();
  const mounted = useRef(true);
  const disconnected = useRef(false);
  const ContainerRef = useRef(null);
  const [categoriesShown, setCategoriesShown] = useState(false);
  const { atBottom, scrollTop } = useScrollToBottom(ContainerRef, 30);
  const category = getSectionFromPathname(location.pathname)?.section;

  useEffect(() => {
    if (scrollTop === 0) {
      setCategoriesShown(false);
    } else if (atBottom) {
      setCategoriesShown(true);
    }
  }, [atBottom, scrollTop]);

  useEffect(() => {
    return function componentWillRefresh() {
      setCategoriesShown(false);
    };
  }, [category]);

  useEffect(() => {
    mounted.current = true;
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    function onConnect() {
      if (disconnected.current && mounted.current) {
        onClearLinksLoaded();
        onReloadSubjects();
        onClearVideosLoaded();
      }
      disconnected.current = false;
    }
    function onDisconnect() {
      disconnected.current = true;
    }
    return function cleanUp() {
      socket.removeListener('connect', onConnect);
      socket.removeListener('disconnect', onDisconnect);
      mounted.current = false;
    };
  });

  return (
    <ErrorBoundary>
      <div
        ref={ContainerRef}
        className={css`
          width: 100%;
          display: flex;
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 0;
          }
        `}
      >
        <MenuItems
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
              color: ${Color.darkGray()};
              text-decoration: none;
            }
            > a:hover {
              font-weight: bold;
              color: ${Color.black()};
            }
            > a.active {
              font-weight: bold;
              color: ${Color.black()};
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
          <Search
            history={history}
            pathname={location.pathname}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              marginBottom: '4rem'
            }}
          />
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/videos" component={Videos} />
              <Route path="/links" component={Links} />
              <Route path="/subjects" component={Subjects} />
            </Switch>
          </Suspense>
          {categoriesShown && (
            <Categories
              style={{ marginTop: '3rem', marginBottom: '4rem' }}
              filter={category}
            />
          )}
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
            top: 4.5rem;
            bottom: 0;
            position: absolute;
            @media (max-width: ${mobileMaxWidth}) {
              display: none;
            }
          `}
          location={location.pathname.substring(1)}
        />
      </div>
    </ErrorBoundary>
  );
}
