import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ContentListItem from 'components/ContentListItem';
import SectionPanel from 'components/SectionPanel';
import SelectFeaturedSubjects from './Modals/SelectFeaturedSubjects';
import Button from 'components/Button';
import { useScrollPosition } from 'helpers/hooks';
import { useAppContext, useViewContext, useExploreContext } from 'contexts';

Subjects.propTypes = {
  location: PropTypes.object.isRequired
};

export default function Subjects({ location }) {
  const {
    user: {
      state: { userId, canPinPlaylists }
    },
    requestHelpers: { loadFeaturedSubjects }
  } = useAppContext();
  const {
    state: {
      subjects: { loaded, featured }
    },
    actions: { onLoadFeaturedSubjects }
  } = useExploreContext();
  const {
    actions: { onRecordScrollPosition },
    state: { scrollPositions }
  } = useViewContext();
  useScrollPosition({
    onRecordScrollPosition,
    pathname: location.pathname,
    scrollPositions
  });
  const prevLoaded = useRef(false);
  useEffect(() => {
    init();
    async function init() {
      if (!loaded) {
        const subjects = await loadFeaturedSubjects();
        onLoadFeaturedSubjects(subjects);
        prevLoaded.current = true;
      }
    }
  }, [loaded]);
  const [modalShown, setModalShown] = useState(false);
  return (
    <div>
      <ErrorBoundary>
        <SectionPanel
          title="Featured Subjects"
          button={
            userId && canPinPlaylists ? (
              <Button
                skeuomorphic
                color="darkerGray"
                style={{ marginLeft: 'auto' }}
                onClick={() => setModalShown(true)}
              >
                Select Subjects
              </Button>
            ) : null
          }
          isEmpty={featured.length === 0}
          emptyMessage="No featured subjects for now..."
          loaded={loaded || prevLoaded.current}
        >
          {featured.map(subject => (
            <ContentListItem
              key={subject.id}
              style={{ marginBottom: '1rem' }}
              contentObj={subject}
            />
          ))}
        </SectionPanel>
        {modalShown && (
          <SelectFeaturedSubjects
            subjects={featured}
            onHide={() => setModalShown(false)}
            onSubmit={selectedSubjects => {
              onLoadFeaturedSubjects(selectedSubjects);
              setModalShown(false);
            }}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}
