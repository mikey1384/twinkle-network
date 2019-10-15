import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ContentPanel from 'components/ContentPanel';
import NotFound from 'components/NotFound';
import request from 'axios';
import URL from 'constants/URL';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { mobileMaxWidth } from 'constants/css';
import { useScrollPosition } from 'helpers/hooks';
import { css } from 'emotion';
import { useAppContext, useContentContext, useViewContext } from 'contexts';

ContentPage.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default function ContentPage({
  location: { pathname },
  history,
  match: {
    params: { contentId: initialContentId },
    url
  }
}) {
  const contentId = Number(initialContentId);
  const {
    user: {
      state: { userId }
    }
  } = useAppContext();
  const {
    actions: { onRecordScrollPosition, onSetExploreSubNav },
    state: { scrollPositions }
  } = useViewContext();
  useScrollPosition({
    onRecordScrollPosition,
    pathname,
    scrollPositions
  });
  const { state } = useContentContext();
  const contentType = url.split('/')[1].slice(0, -1);
  const contentState = state[contentType + contentId] || {};
  const { loaded, deleted } = contentState;
  const [exists, setExists] = useState(true);
  const mounted = useRef(null);
  const prevDeleted = useRef(false);

  useEffect(() => {
    if (!prevDeleted.current && deleted) {
      onSetExploreSubNav('');
      history.push('/');
    }
    prevDeleted.current = deleted;
  }, [deleted, loaded]);

  useEffect(() => {
    mounted.current = true;
    if (!loaded) {
      initContent();
    }
    async function initContent() {
      try {
        const {
          data: { exists }
        } = await request.get(
          `${URL}/content/check?contentId=${contentId}&contentType=${contentType}`
        );
        if (mounted.current) {
          setExists(exists);
        }
      } catch (error) {
        console.error(error);
        setExists(false);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [contentId, url]);

  return useMemo(
    () => (
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
            {exists ? (
              <ContentPanel
                key={contentType + contentId}
                autoExpand
                commentsLoadLimit={5}
                contentId={Number(contentId)}
                contentType={contentType}
                userId={userId}
              />
            ) : (
              <NotFound />
            )}
          </section>
        </div>
      </ErrorBoundary>
    ),
    [exists]
  );
}
