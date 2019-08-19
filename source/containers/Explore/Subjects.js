import React from 'react';
import PropTypes from 'prop-types';
import ChallengesPanel from './Panels/ChallengesPanel';

Subjects.propTypes = {
  history: PropTypes.object.isRequired
};

export default function Subjects({ history }) {
  return (
    <div>
      <ChallengesPanel history={history} />
    </div>
  );
}
