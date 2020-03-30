import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';

GiveRewardButton.propTypes = {
  rewardIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  phrase: PropTypes.string.isRequired,
  feedback: PropTypes.string,
  onSetFeedback: PropTypes.func.isRequired
};

export default function GiveRewardButton({
  rewardIcon,
  feedback,
  phrase,
  onSetFeedback
}) {
  return (
    <Button onClick={() => onSetFeedback(phrase)} filled={phrase === feedback}>
      <Icon
        size="lg"
        icon={rewardIcon}
        style={{
          marginLeft: '1rem'
        }}
      />
      <span>{phrase}</span>
    </Button>
  );
}
