import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContentListItem from 'components/ContentListItem';
import SectionPanel from 'components/SectionPanel';
import SelectFeaturedChallenges from '../Modals/SelectFeaturedChallenges';
import Button from 'components/Button';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { connect } from 'react-redux';

ChallengesPanel.propTypes = {
  canPinPlaylists: PropTypes.bool,
  challenges: PropTypes.array.isRequired,
  loaded: PropTypes.bool,
  onSelectedChallengesSubmit: PropTypes.func.isRequired,
  userId: PropTypes.number
};

function ChallengesPanel({
  canPinPlaylists,
  challenges,
  loaded,
  onSelectedChallengesSubmit,
  userId
}) {
  const [modalShown, setModalShown] = useState(false);

  return (
    <ErrorBoundary>
      <SectionPanel
        title="Featured Subjects"
        button={
          userId && canPinPlaylists ? (
            <Button
              snow
              style={{ marginLeft: 'auto' }}
              onClick={() => setModalShown(true)}
            >
              Select Subjects
            </Button>
          ) : null
        }
        isEmpty={challenges.length === 0}
        emptyMessage="No featured subjects for now..."
        loaded={loaded}
      >
        {challenges.map(challenge => (
          <ContentListItem key={challenge.id} contentObj={challenge} />
        ))}
      </SectionPanel>
      {modalShown && (
        <SelectFeaturedChallenges
          onHide={() => setModalShown(false)}
          onSubmit={selectedChallenges => {
            onSelectedChallengesSubmit(selectedChallenges);
            setModalShown(false);
          }}
        />
      )}
    </ErrorBoundary>
  );
}

export default connect(state => ({
  canPinPlaylists: state.UserReducer.canPinPlaylists,
  userId: state.UserReducer.userId
}))(ChallengesPanel);
