import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { Link } from 'react-router-dom';
import { Color } from 'constants/css';

SubjectLink.propTypes = {
  subject: PropTypes.object.isRequired
};

export default function SubjectLink({ subject }) {
  return (
    <ErrorBoundary>
      <Link
        style={{
          fontWeight: 'bold',
          color: Color.green()
        }}
        to={`/subjects/${subject.id}`}
      >
        {subject.title}
      </Link>
    </ErrorBoundary>
  );
}
