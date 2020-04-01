import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';

RewardFeedback.propTypes = {
  color: PropTypes.string,
  rewardIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  phrase: PropTypes.string.isRequired,
  feedback: PropTypes.string,
  onSetFeedback: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function RewardFeedback({
  color,
  rewardIcon,
  feedback,
  phrase,
  onSetFeedback,
  style
}) {
  return (
    <Button
      color={color}
      onClick={() => onSetFeedback(phrase)}
      filled={phrase === feedback}
      style={style}
    >
      <Icon size="lg" icon={rewardIcon} />
      <span style={{ marginLeft: '1rem' }}>{phrase}</span>
    </Button>
  );
}
