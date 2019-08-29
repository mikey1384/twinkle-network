import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ContentListItem from 'components/ContentListItem';
import SectionPanel from 'components/SectionPanel';
import SelectFeaturedSubjects from './Modals/SelectFeaturedSubjects';
import Button from 'components/Button';
import { loadFeaturedSubjects } from 'helpers/requestHelpers';
import { getFeaturedSubjects } from 'redux/actions/ChallengeActions';
import { connect } from 'react-redux';

Subjects.propTypes = {
  canPinPlaylists: PropTypes.bool,
  featuredChallenges: PropTypes.array.isRequired,
  getFeaturedSubjects: PropTypes.func.isRequired,
  loaded: PropTypes.bool,
  userId: PropTypes.number
};

function Subjects({
  canPinPlaylists,
  featuredChallenges,
  getFeaturedSubjects,
  loaded,
  userId
}) {
  useEffect(() => {
    init();
    async function init() {
      if (!loaded) {
        const challenges = await loadFeaturedSubjects();
        getFeaturedSubjects(challenges);
      }
    }
  }, []);
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
          isEmpty={featuredChallenges.length === 0}
          emptyMessage="No featured subjects for now..."
          loaded={loaded}
        >
          {featuredChallenges.map(challenge => (
            <ContentListItem
              key={challenge.id}
              style={{ marginBottom: '1rem' }}
              contentObj={challenge}
            />
          ))}
        </SectionPanel>
        {modalShown && (
          <SelectFeaturedSubjects
            selectedChallenges={featuredChallenges}
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
    loaded: state.ChallengeReducer.featuredChallengesLoaded,
    featuredChallenges: state.ChallengeReducer.featuredChallenges,
    userId: state.UserReducer.userId
  }),
  { getFeaturedSubjects }
)(Subjects);
