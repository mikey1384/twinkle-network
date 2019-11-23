import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';
import request from 'axios';
import URL from 'constants/URL';

Redirect.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default function Redirect({
  match: {
    params: { username }
  },
  history
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    init();

    async function init() {
      const { data: userExists } = await request.get(
        `${URL}/user/check?username=${username}`
      );
      if (userExists) return history.push(`/users/${username}`);
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>{loaded ? <NotFound /> : <Loading text="Loading..." />}</div>;
}
