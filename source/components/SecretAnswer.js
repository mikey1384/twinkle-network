import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import LongText from 'components/Texts/LongText';
import { borderRadius, Color } from 'constants/css';
import { useAppContext, useContentContext } from 'contexts';

SecretAnswer.propTypes = {
  answer: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
  subjectId: PropTypes.number,
  uploaderId: PropTypes.number
};

export default function SecretAnswer({
  answer,
  onClick,
  style,
  subjectId,
  uploaderId
}) {
  const {
    user: {
      state: { userId }
    },
    requestHelpers: { checkIfUserResponded }
  } = useAppContext();
  const {
    state,
    actions: { onChangeSpoilerStatus }
  } = useContentContext();
  const contentState = state['subject' + subjectId] || {};
  const { spoilerStatusChecked } = contentState;
  const secretShown = contentState.secretShown || uploaderId === userId;
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    if (userId && !spoilerStatusChecked) {
      init();
    }
    if (spoilerStatusChecked && contentState.secretShown) {
      onChangeSpoilerStatus({
        shown: true,
        subjectId,
        checked: true
      });
    }
    if (!userId) {
      onChangeSpoilerStatus({ shown: false, subjectId, checked: false });
    }

    async function init() {
      if (!secretShown) {
        const { responded } = await checkIfUserResponded(subjectId);
        if (mounted.current) {
          onChangeSpoilerStatus({
            shown: responded,
            subjectId,
            checked: true
          });
        }
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
  }, [spoilerStatusChecked, userId]);
  return useMemo(
    () => (
      <ErrorBoundary>
        <div
          onClick={secretShown ? () => {} : onClick}
          style={{
            cursor: secretShown ? '' : 'pointer',
            fontSize: '1.7rem',
            background: secretShown ? Color.ivory() : Color.darkerGray(),
            border: `1px solid ${
              secretShown ? Color.borderGray() : Color.black()
            }`,
            borderRadius,
            color: secretShown ? Color.black() : '#fff',
            textAlign: secretShown ? '' : 'center',
            padding: '1rem',
            ...style
          }}
        >
          {secretShown && <LongText>{answer}</LongText>}
          {!secretShown && (
            <span>
              Submit your response to view the secret message. Tap here
            </span>
          )}
        </div>
      </ErrorBoundary>
    ),
    [secretShown, answer]
  );
}
