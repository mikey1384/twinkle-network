import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

Head.propTypes = {
  numNewNotis: PropTypes.number,
  numNewPosts: PropTypes.number,
  chatMode: PropTypes.bool,
  chatNumUnreads: PropTypes.number
};

function Head({ numNewNotis, numNewPosts, chatMode, chatNumUnreads }) {
  const [title, setTitle] = useState('Twinkle');
  useEffect(() => {
    const newNotiNum = numNewPosts + numNewNotis + chatNumUnreads;
    setTitle(`${newNotiNum > 0 ? `(${newNotiNum}) ` : ''}Twinkle`);
  }, [numNewNotis, numNewPosts, chatMode, chatNumUnreads]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export default connect(state => ({
  chatMode: state.ChatReducer.chatMode,
  numNewPosts: state.NotiReducer.numNewPosts,
  numNewNotis: state.NotiReducer.numNewNotis,
  chatNumUnreads: state.ChatReducer.numUnreads
}))(Head);
