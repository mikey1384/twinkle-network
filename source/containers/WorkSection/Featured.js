import React from 'react';
import PropTypes from 'prop-types';
import ChallengesPanel from './Panels/ChallengesPanel';
import FeaturedPlaylistsPanel from './Panels/FeaturedPlaylistsPanel';

Featured.propTypes = {
  history: PropTypes.object.isRequired
};

export default function Featured({ history }) {
  return (
    <div>
      <ChallengesPanel history={history} />
      <FeaturedPlaylistsPanel history={history} />
    </div>
  );
}
