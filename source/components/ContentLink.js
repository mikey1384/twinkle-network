import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Color } from 'constants/css';
import { removeLineBreaks } from 'helpers/stringHelpers';

ContentLink.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string
  }).isRequired,
  style: PropTypes.object,
  type: PropTypes.string
};
export default function ContentLink({
  style,
  content: { byUser, id, content, title, username },
  type,
  ...actions
}) {
  let destination = '';
  if (type === 'url') {
    destination = 'links';
  } else {
    destination = type + 's';
  }
  title = title || content || username;
  return title ? (
    <Link
      style={{
        fontWeight: 'bold',
        color: type === 'video' && byUser ? Color.orange() : Color.blue(),
        ...style
      }}
      to={`/${destination}/${type === 'user' ? username : id}`}
    >
      {removeLineBreaks(title)}
    </Link>
  ) : (
    <span style={{ fontWeight: 'bold', color: Color.darkerGray() }}>
      (Deleted)
    </span>
  );
}
