import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ContentListItem from 'components/ContentListItem';
import SectionPanel from 'components/SectionPanel';
import SelectFeaturedChallenges from '../Modals/SelectFeaturedChallenges';
import Button from 'components/Button';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { loadFeaturedChallenges } from 'helpers/requestHelpers';
import { getFeaturedChallenges } from 'redux/actions/ChallengeActions';
import { connect } from 'react-redux';

ChallengesPanel.propTypes = {
  canPinPlaylists: PropTypes.bool,
  featuredChallenges: PropTypes.array.isRequired,
  getFeaturedChallenges: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loaded: PropTypes.bool,
  userId: PropTypes.number
};

function ChallengesPanel({
  canPinPlaylists,
  featuredChallenges,
  getFeaturedChallenges,
  history,
  loaded,
  userId
}) {
  useEffect(() => {
    init();
    async function init() {
      if (history.action === 'PUSH' || !loaded) {
        const challenges = await loadFeaturedChallenges();
        getFeaturedChallenges(challenges);
      }
    }
  }, []);
  const [modalShown, setModalShown] = useState(false);

  return (
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
        <SelectFeaturedChallenges
          selectedChallenges={featuredChallenges}
          onHide={() => setModalShown(false)}
          onSubmit={selectedChallenges => {
            getFeaturedChallenges(selectedChallenges);
            setModalShown(false);
          }}
        />
      )}
    </ErrorBoundary>
  );
}

export default connect(
  state => ({
    canPinPlaylists: state.UserReducer.canPinPlaylists,
    loaded: state.ChallengeReducer.featuredChallengesLoaded,
    featuredChallenges: state.ChallengeReducer.featuredChallenges,
    userId: state.UserReducer.userId
  }),
  { getFeaturedChallenges }
)(ChallengesPanel);
