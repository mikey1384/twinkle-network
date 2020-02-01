import React from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/Buttons/DropdownButton';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

PeopleFilterBar.propTypes = {
  dropdownLabel: PropTypes.string,
  onSetOrderByText: PropTypes.func,
  orderByText: PropTypes.string,
  style: PropTypes.object
};

export default function PeopleFilterBar({
  dropdownLabel,
  onSetOrderByText,
  orderByText,
  style
}) {
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
            label: dropdownLabel,
            onClick: () => onSetOrderByText(dropdownLabel)
          }
        ]}
      />
    </div>
  );
}
