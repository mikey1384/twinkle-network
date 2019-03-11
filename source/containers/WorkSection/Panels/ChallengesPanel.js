import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContentListItem from 'components/ContentListItem';
import SectionPanel from 'components/SectionPanel';
import SelectFeaturedChallenges from '../Modals/SelectFeaturedChallenges';
import Button from 'components/Button';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { connect } from 'react-redux';

ChallengesPanel.propTypes = {
  challenges: PropTypes.array.isRequired,
  loaded: PropTypes.bool,
  userId: PropTypes.number
};

function ChallengesPanel({ challenges, loaded, userId }) {
  const [selectFeaturedChallengesShown, setSelectFeaturedChallenges] = useState(
    false
  );
  return (
    <ErrorBoundary>
      <SectionPanel
        title="Featured Subjects"
        button={
          userId ? (
            <Button
              snow
              style={{ marginLeft: 'auto' }}
              onClick={() => setSelectFeaturedChallenges(true)}
            >
              Select Subjects
            </Button>
          ) : null
        }
        isEmpty={false}
        loaded={loaded}
      >
        {challenges.map(challenge => (
          <ContentListItem
            key={challenge.id}
            onClick={() => console.log('nothign')}
            type={challenge.type}
            contentObj={challenge}
          />
        ))}
      </SectionPanel>
      {selectFeaturedChallengesShown && (
        <SelectFeaturedChallenges
          onHide={() => setSelectFeaturedChallenges(false)}
        />
      )}
    </ErrorBoundary>
  );
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(ChallengesPanel);
