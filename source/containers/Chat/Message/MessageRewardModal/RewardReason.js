import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { rewardReasons } from 'constants/defaultValues';

RewardReason.propTypes = {
  reasonId: PropTypes.number.isRequired,
  selectedReasonId: PropTypes.number,
  onSelectReasonId: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function RewardReason({
  selectedReasonId,
  reasonId,
  onSelectReasonId,
  style
}) {
  return (
    <Button
      color={rewardReasons[reasonId].color}
      onClick={() => onSelectReasonId(reasonId)}
      filled={reasonId === selectedReasonId}
      style={style}
    >
      <Icon size="lg" icon={rewardReasons[reasonId].icon} />
      <span style={{ marginLeft: '1rem' }}>
        {rewardReasons[reasonId].message}
      </span>
    </Button>
  );
}
