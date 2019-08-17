import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

Head.propTypes = {
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  chatNumUnreads: PropTypes.number
};

function Head({ numNewNotis, numNewPosts, chatNumUnreads }) {
  const [title, setTitle] = useState('Twinkle');
  useEffect(() => {
    const newNotiNum = numNewPosts + numNewNotis + chatNumUnreads;
    setTitle(`${newNotiNum > 0 ? `(${newNotiNum}) ` : ''}Twinkle`);
  }, [numNewNotis, numNewPosts, chatNumUnreads]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export default connect(state => ({
  numNewPosts: state.NotiReducer.numNewPosts,
  numNewNotis: state.NotiReducer.numNewNotis,
  chatNumUnreads: state.ChatReducer.numUnreads
}))(Head);
