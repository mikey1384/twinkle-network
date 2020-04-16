import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import { unix } from 'moment';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';

const marginHeight = 1;
const subjectTitleHeight = 24;

SubjectItem.propTypes = {
  id: PropTypes.number,
  currentSubjectId: PropTypes.number,
  content: PropTypes.string,
  userId: PropTypes.number,
  username: PropTypes.string,
  onDeleteSubject: PropTypes.func,
  onSelectSubject: PropTypes.func,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default function SubjectItem({
  currentSubjectId,
  onDeleteSubject,
  onSelectSubject,
  id,
  content,
  userId,
  username,
  timeStamp
}) {
  const [marginBottom, setMarginBottom] = useState(`${marginHeight}rem`);
  const SubjectTitleRef = useRef(null);
  const { authLevel, canDelete } = useMyState();

  useEffect(() => {
    const numLines = SubjectTitleRef.current.clientHeight / subjectTitleHeight;
    setMarginBottom(`${numLines * marginHeight}rem`);
  }, []);

  const buttons = useMemo(() => {
    const result = [];
    if (currentSubjectId !== id && authLevel > 3 && canDelete) {
      result.push({
        color: 'rose',
        opacity: 0.5,
        onClick: onDeleteSubject,
        label: 'Remove'
      });
    }
    if (currentSubjectId !== id) {
      result.push({
        color: 'green',
        opacity: 0.5,
        onClick: onSelectSubject,
        label: 'Select'
      });
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLevel, canDelete, currentSubjectId, id]);

  return (
    <div
      style={{
        minHeight: '50px',
        height: 'auto',
        width: '100%'
      }}
    >
      <ButtonGroup
        style={{ position: 'absolute', right: '1.5rem' }}
        buttons={buttons}
      />
      <div
        style={{
          width: '100%',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-word'
        }}
      >
        <div ref={SubjectTitleRef} style={{ marginBottom }}>
          {currentSubjectId === id && (
            <b style={{ fontSize: '1.5rem', color: Color.green() }}>
              Current:{' '}
            </b>
          )}
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div>
            <UsernameText
              color={Color.darkerGray()}
              user={{
                id: userId,
                username: username
              }}
            />{' '}
            <small>{unix(timeStamp).format('LLL')}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
