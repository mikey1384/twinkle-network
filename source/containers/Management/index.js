import React, { useEffect, useMemo } from 'react';
import NotFound from 'components/NotFound';
import Main from './Main';
import Loading from 'components/Loading';
import { useMyState } from 'helpers/hooks';
import { useManagementContext } from 'contexts';

export default function Management() {
  const {
    state: { loaded },
    actions: { onLoadManagement }
  } = useManagementContext();
  const { loaded: userLoaded, userType } = useMyState();
  useEffect(() => {
    onLoadManagement();
  }, []);

  return useMemo(
    () =>
      !loaded || !userLoaded ? (
        <Loading />
      ) : userType ? (
        <Main />
      ) : (
        <NotFound
          title="For moderators only"
          text="You are not authorized to view this page"
        />
      ),
    [loaded, userLoaded, userType]
  );
}
