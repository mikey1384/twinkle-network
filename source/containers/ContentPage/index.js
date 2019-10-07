import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ContentPanel from 'components/ContentPanel';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';
import request from 'axios';
import URL from 'constants/URL';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import {
  useAppContext,
  useHomeContext,
  useViewContext,
  useExploreContext
} from '../../contexts';

ContentPage.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default function ContentPage({
  history,
  match: {
    params: { contentId },
    url
  }
}) {
  const {
    profile: {
      actions: { onDeleteFeed: onDeleteProfileFeed }
    },
    user: {
      state: { userId }
    }
  } = useAppContext();
  const {
    actions: { onDeleteSubject }
  } = useExploreContext();
  const {
    actions: { onSetExploreSubNav }
  } = useViewContext();
  const {
    actions: { onDeleteFeed: onDeleteHomeFeed }
  } = useHomeContext();
  const contentType = url.split('/')[1].slice(0, -1);
  const [{ loaded, exists }, setContentStatus] = useState({
    loaded: false,
    exists: false
  });
  const mounted = useRef(null);
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  useEffect(() => {
    mounted.current = true;
    document.getElementById('App').scrollTop = 0;
    BodyRef.current.scrollTop = 0;
    initContent();
    async function initContent() {
      try {
        const {
          data: { exists }
        } = await request.get(
          `${URL}/content/check?contentId=${contentId}&contentType=${contentType}`
        );
        if (mounted.current) {
          setContentStatus({
            loaded: true,
            exists
          });
        }
      } catch (error) {
        console.error(error);
        setContentStatus({
          loaded: true,
          exists: false
        });
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [contentId, url]);

  return (
    <ErrorBoundary
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <div
        className={css`
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          margin-top: 1rem;
          padding-bottom: 20rem;
        `}
      >
        <section
          className={css`
            width: 65%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              min-height: 100vh;
            }
          `}
        >
          {loaded ? (
            exists ? (
              <ContentPanel
                key={contentType + contentId}
                autoExpand
                commentsLoadLimit={5}
                contentId={Number(contentId)}
                contentType={contentType}
                userId={userId}
                onDeleteContent={handleDeleteContent}
              />
            ) : (
              <NotFound />
            )
          ) : (
            <Loading />
          )}
        </section>
      </div>
    </ErrorBoundary>
  );

  function handleDeleteContent() {
    if (contentType === 'subject') {
      onDeleteSubject(contentId);
    }
    onDeleteHomeFeed({ contentType, contentId });
    onDeleteProfileFeed({ contentType, contentId });
    onSetExploreSubNav('');
    history.push('/');
  }
}
