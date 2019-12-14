import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import NotFound from 'components/NotFound';
import Routes from './Routes';
import Loading from 'components/Loading';
import { useMyState } from 'helpers/hooks';
import { useManagementContext } from 'contexts';

Management.propTypes = {
  location: PropTypes.object
};

export default function Management({ location }) {
  const {
    state: { loaded },
    actions: { onLoadManagement }
  } = useManagementContext();
  const { loaded: userLoaded, managementLevel } = useMyState();
  useEffect(() => {
    onLoadManagement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managementLevel]);

  return !loaded || !userLoaded ? (
    <Loading />
  ) : managementLevel > 0 ? (
    <Routes location={location} />
  ) : (
    <NotFound
      title="For moderators only"
      text="You are not authorized to view this page"
    />
  );
}
