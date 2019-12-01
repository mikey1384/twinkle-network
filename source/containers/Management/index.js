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
  const { loaded: userLoaded, userType } = useMyState();
  useEffect(() => {
    onLoadManagement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  return !loaded || !userLoaded ? (
    <Loading />
  ) : userType ? (
    <Routes location={location} />
  ) : (
    <NotFound
      title="For moderators only"
      text="You are not authorized to view this page"
    />
  );
}
