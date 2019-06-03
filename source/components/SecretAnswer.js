import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import LongText from 'components/Texts/LongText';
import { connect } from 'react-redux';
import { borderRadius, Color } from 'constants/css';
import { checkIfUserResponded } from 'helpers/requestHelpers';

SecretAnswer.propTypes = {
  answer: PropTypes.string.isRequired,
  shownJustNow: PropTypes.bool,
  onClick: PropTypes.func,
  subjectId: PropTypes.number,
  userId: PropTypes.number
};

function SecretAnswer({ answer, shownJustNow, userId, onClick, subjectId }) {
  const [shown, setShown] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    if (userId) {
      init();
    }
    if (shownJustNow) {
      setShown(true);
    }

    async function init() {
      const { responded } = await checkIfUserResponded(subjectId);
      if (mounted.current) {
        setShown(responded);
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
  }, [shownJustNow, userId]);

  return (
    <ErrorBoundary>
      <div
        onClick={shown ? () => {} : onClick}
        style={{
          cursor: shown ? '' : 'pointer',
          fontSize: '1.7rem',
          background: shown ? Color.ivory() : Color.darkerGray(),
          border: `1px solid ${shown ? Color.borderGray() : Color.black()}`,
          borderRadius,
          color: shown ? '' : '#fff',
          textAlign: shown ? '' : 'center',
          padding: '1rem'
        }}
      >
        {shown && <LongText>{answer}</LongText>}
        {!shown && (
          <span>Submit your response if you wish to view the answer</span>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default connect(state => ({ userId: state.UserReducer.userId }))(
  SecretAnswer
);
