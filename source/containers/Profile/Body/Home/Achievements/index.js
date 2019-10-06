import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import MonthlyXp from './MonthlyXp';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { useAppContext } from 'contexts';

Achievements.propTypes = {
  profile: PropTypes.object.isRequired,
  selectedTheme: PropTypes.string
};

export default function Achievements({
  profile,
  profile: { id, username },
  selectedTheme
}) {
  const {
    profile: {
      state: {
        notables: { feeds, loadMoreButton }
      },
      actions: { onDeleteFeed, onLoadNotables, onLoadMoreNotables }
    },
    requestHelpers: { loadMoreNotableContents, loadNotableContent }
  } = useAppContext();
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    initNotables();
    async function initNotables() {
      const { results, loadMoreButton } = await loadNotableContent({
        userId: id
      });
      if (mounted.current) {
        onLoadNotables({ feeds: results, loadMoreButton });
        setLoading(false);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [profile.id]);

  return (
    <ErrorBoundary>
      <SectionPanel
        customColorTheme={selectedTheme}
        title="Notable Activities"
        loaded={!loading}
      >
        {feeds.length === 0 && (
          <div
            style={{ fontSize: '2rem', textAlign: 'center' }}
          >{`${username} hasn't engaged in an activity worth showing here, yet`}</div>
        )}
        {feeds.map((notable, index) => {
          const { contentId, contentType } = notable;
          return (
            <ContentPanel
              key={contentType + contentId}
              style={{ marginBottom: '1rem', zIndex: feeds.length - index }}
              contentId={contentId}
              contentType={contentType}
              commentsLoadLimit={5}
              numPreviewComments={1}
              onDeleteContent={onDeleteFeed}
            />
          );
        })}
        {loadMoreButton && (
          <LoadMoreButton
            style={{ fontSize: '1.7rem' }}
            label="Show More"
            transparent
            onClick={handleLoadMoreNotables}
          />
        )}
      </SectionPanel>
      <MonthlyXp selectedTheme={selectedTheme} userId={id} />
    </ErrorBoundary>
  );

  async function handleLoadMoreNotables() {
    const { results, loadMoreButton } = await loadMoreNotableContents({
      userId: profile.id,
      notables: feeds
    });
    onLoadMoreNotables({ feeds: results, loadMoreButton });
  }
}
