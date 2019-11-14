import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { css } from 'emotion';

MafiaInventory.propTypes = {
  role: PropTypes.string
};

export default function MafiaInventory({ role }) {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: row;
        p {
          font-size: 1.8rem;
          font-weight: bold;
          margin-top: 0.46rem;
          margin-right: 1.5rem;
        }
      `}
    >
      <p>You are a {role}</p>
      {role === 'murderer' && <Button>Hold Knife</Button>}
      {role === 'detective' && <Button>Hold Revolver</Button>}
    </div>
  );
}
