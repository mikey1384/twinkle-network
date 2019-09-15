import React, { useContext, useEffect, useState } from 'react';
import { useScrollPosition } from 'helpers/hooks';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ContentListItem from 'components/ContentListItem';
import SectionPanel from 'components/SectionPanel';
import SelectFeaturedSubjects from './Modals/SelectFeaturedSubjects';
import Button from 'components/Button';
import { loadFeaturedSubjects } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { Context } from 'context';

Subjects.propTypes = {
  canPinPlaylists: PropTypes.bool,
  location: PropTypes.object.isRequired,
  userId: PropTypes.number
};

function Subjects({ canPinPlaylists, location, userId }) {
  const {
    view: {
      state: { scrollPositions },
      actions: { onRecordScrollPosition }
    },
    explore: {
      state: {
        subjects: { loaded, featured }
      },
      actions: { onLoadFeaturedSubjects }
    }
  } = useContext(Context);
  useScrollPosition({
    scrollPositions,
    pathname: location.pathname,
    onRecordScrollPosition,
    currentSection: '/subjects'
  });
  useEffect(() => {
    init();
    async function init() {
      if (!loaded) {
        const subjects = await loadFeaturedSubjects();
        onLoadFeaturedSubjects(subjects);
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
          loaded={loaded}
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
            onSubmit={selectedChallenges => {
              onLoadFeaturedSubjects(selectedChallenges);
              setModalShown(false);
            }}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default connect(state => ({
  canPinPlaylists: state.UserReducer.canPinPlaylists,
  userId: state.UserReducer.userId
}))(Subjects);
