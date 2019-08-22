import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/Buttons/DropdownButton';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

PeopleFilterBar.propTypes = {
  style: PropTypes.object
};

const LAST_ONLINE_FILTER_LABEL = 'Last Online';
const RANKING_FILTER_LABEL = 'Ranking';

export default function PeopleFilterBar({ style }) {
  const [orderByText, setOrderByText] = useState(LAST_ONLINE_FILTER_LABEL);
  const label =
    orderByText === LAST_ONLINE_FILTER_LABEL
      ? RANKING_FILTER_LABEL
      : LAST_ONLINE_FILTER_LABEL;
  return (
    <div
      className={css`
        border: 1px solid ${Color.borderGray()};
        @media (max-width: ${mobileMaxWidth}) {
          border-right: 0;
          border-left: 0;
        }
      `}
      style={{
        padding: '1rem',
        background: '#fff',
        display: 'flex',
        justifyContent: 'flex-end',
        height: '100%',
        width: '100%',
        ...style
      }}
    >
      <DropdownButton
        skeuomorphic
        color="darkerGray"
        direction="left"
        icon="caret-down"
        text={orderByText}
        menuProps={[
          {
            label: label,
            onClick: () => setOrderByText(label)
          }
        ]}
      />
    </div>
  );
}
