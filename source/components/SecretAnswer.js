import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import LongText from 'components/Texts/LongText';
import { borderRadius, Color } from 'constants/css';
import { useAppContext } from 'contexts';

SecretAnswer.propTypes = {
  answer: PropTypes.string.isRequired,
  changeSpoilerStatus: PropTypes.func.isRequired,
  shown: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  subjectId: PropTypes.number
};

export default function SecretAnswer({
  answer,
  shown,
  onClick,
  changeSpoilerStatus,
  style,
  subjectId
}) {
  const {
    user: {
      state: { userId }
    },
    view: {
      state: { pageVisible }
    },
    requestHelpers: { checkIfUserResponded }
  } = useAppContext();
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    if (userId) {
      init();
    } else {
      changeSpoilerStatus({ shown: false, subjectId });
    }

    async function init() {
      if (!shown) {
        const { responded } = await checkIfUserResponded(subjectId);
        if (mounted.current) {
          changeSpoilerStatus({ shown: responded, subjectId });
        }
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
  }, [pageVisible, userId]);

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
          color: shown ? Color.black() : '#fff',
          textAlign: shown ? '' : 'center',
          padding: '1rem',
          ...style
        }}
      >
        {shown && <LongText>{answer}</LongText>}
        {!shown && (
          <span>Submit your response to view the secret message. Tap here</span>
        )}
      </div>
    </ErrorBoundary>
  );
}
