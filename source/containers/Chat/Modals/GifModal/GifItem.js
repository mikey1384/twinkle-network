import React from 'react';
import PropTypes from 'prop-types';

GifItem.propTypes = {
  gif: PropTypes.string
};

export default function GifItem({ gif }) {
  return <img alt="gif" url={gif.url} />;
}
