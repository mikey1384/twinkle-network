import React, { useState } from 'react';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';
import { borderRadius, Color } from 'constants/css';
import { css } from 'emotion';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { rewardChat } from 'constants/defaultValues';

GiveRewardButton.propTypes = {
  rewardIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  phrase: PropTypes.string.isRequired,
  selection: PropTypes.string.isRequired,
  setSelection: PropTypes.func.isRequired
};

export default function GiveRewardButton({
  rewardIcon,
  phrase,
  selection,
  setSelection
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={css`
        display: flex;
        width: 65%;
        height: 4rem;
        align-content: center;
        align-items: center;
        align-text: center;
        flex-direction: row;
        border-radius: ${borderRadius};
        padding: 2rem 0 2rem 0;
        cursor: pointer;
        background: ${hover || selection === phrase
          ? Color.lightBlue()
          : 'none'};
        div {
          font-size: 1.8rem;
          font-weight: bold;
          margin-left: 0.9rem;
          color: ${hover || selection === phrase
            ? Color.white()
            : Color.black()};
        }
      `}
      onMouseLeave={() => setHover(false)}
      onMouseEnter={() => setHover(true)}
      onClick={() =>
        selection === phrase ? setSelection('') : setSelection(phrase)
      }
    >
      <Icon
        size="lg"
        icon={rewardIcon}
        color={hover || selection === phrase ? Color.white() : Color.rose()}
        style={{
          marginLeft: '1rem'
        }}
      />
      <div>
        {phrase}: (+{addCommasToNumber(rewardChat[phrase])} XP)
      </div>
    </div>
  );
}
