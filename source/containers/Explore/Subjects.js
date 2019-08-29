import React, { useEffect, useState } from 'react';
import { useScrollPosition } from 'helpers/hooks';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ContentListItem from 'components/ContentListItem';
import SectionPanel from 'components/SectionPanel';
import SelectFeaturedSubjects from './Modals/SelectFeaturedSubjects';
import Button from 'components/Button';
import { loadFeaturedSubjects } from 'helpers/requestHelpers';
import { getFeaturedSubjects } from 'redux/actions/SubjectActions';
import { recordScrollPosition } from 'redux/actions/ViewActions';
import { connect } from 'react-redux';

Subjects.propTypes = {
  canPinPlaylists: PropTypes.bool,
  featuredSubjects: PropTypes.array.isRequired,
  getFeaturedSubjects: PropTypes.func.isRequired,
  loaded: PropTypes.bool,
  location: PropTypes.object.isRequired,
  recordScrollPosition: PropTypes.func.isRequired,
  scrollPositions: PropTypes.object,
  userId: PropTypes.number
};

function Subjects({
  canPinPlaylists,
  featuredSubjects,
  getFeaturedSubjects,
  loaded,
  location,
  recordScrollPosition,
  scrollPositions,
  userId
}) {
  useScrollPosition({
    scrollPositions,
    pathname: location.pathname,
    recordScrollPosition,
    currentSection: '/subjects'
  });
  useEffect(() => {
    init();
    async function init() {
      if (!loaded) {
        const challenges = await loadFeaturedSubjects();
        getFeaturedSubjects(challenges);
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
          isEmpty={featuredSubjects.length === 0}
          emptyMessage="No featured subjects for now..."
          loaded={loaded}
        >
          {featuredSubjects.map(challenge => (
            <ContentListItem
              key={challenge.id}
              style={{ marginBottom: '1rem' }}
              contentObj={challenge}
            />
          ))}
        </SectionPanel>
        {modalShown && (
          <SelectFeaturedSubjects
            selectedChallenges={featuredSubjects}
            onHide={() => setModalShown(false)}
            onSubmit={selectedChallenges => {
              getFeaturedSubjects(selectedChallenges);
              setModalShown(false);
            }}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default connect(
  state => ({
    canPinPlaylists: state.UserReducer.canPinPlaylists,
    loaded: state.SubjectReducer.loaded,
    featuredSubjects: state.SubjectReducer.featuredSubjects,
    scrollPositions: state.ViewReducer.scrollPositions,
    userId: state.UserReducer.userId
  }),
  { getFeaturedSubjects, recordScrollPosition }
)(Subjects);
