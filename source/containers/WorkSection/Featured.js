import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import ChallengesPanel from './Panels/ChallengesPanel';
const FeaturedPlaylistsPanel = React.lazy(() =>
  import('./Panels/FeaturedPlaylistsPanel')
);

Featured.propTypes = {
  history: PropTypes.object.isRequired
};

export default function Featured({ history }) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <ChallengesPanel history={history} />
        <FeaturedPlaylistsPanel history={history} />
      </Suspense>
    </div>
  );
}
