import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import loadable from 'loadable-components';
const ChallengesPanel = loadable(() => import('./Panels/ChallengesPanel'), {
  LoadingComponent: Loading
});
const FeaturedPlaylistsPanel = loadable(
  () => import('./Panels/FeaturedPlaylistsPanel'),
  {
    LoadingComponent: Loading
  }
);

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
