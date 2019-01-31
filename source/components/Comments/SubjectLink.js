import React from 'react';
import PropTypes from 'prop-types';
import { cleanString } from 'helpers/stringHelpers';
import { Link } from 'react-router-dom';
import { Color } from 'constants/css';

SubjectLink.propTypes = {
  subject: PropTypes.object.isRequired
};
export default function SubjectLink({ subject }) {
  return (
    <Link
      style={{
        fontWeight: 'bold',
        color: Color.green()
      }}
      to={`/subjects/${subject.id}`}
    >
      {cleanString(subject.title)}
    </Link>
  );
}
