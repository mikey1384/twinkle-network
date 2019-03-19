import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UsernameText from 'components/Texts/UsernameText';
import { Color } from 'constants/css';
import ButtonGroup from 'components/Buttons/ButtonGroup';

const marginHeight = 1;
const subjectTitleHeight = 24;

SubjectItem.propTypes = {
  id: PropTypes.number,
  currentSubjectId: PropTypes.number,
  content: PropTypes.string,
  numMsgs: PropTypes.string,
  userId: PropTypes.number,
  username: PropTypes.string,
  selectSubject: PropTypes.func,
  showMsgsModal: PropTypes.func,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default function SubjectItem({
  currentSubjectId,
  selectSubject,
  id,
  content,
  userId,
  username,
  timeStamp,
  numMsgs,
  showMsgsModal
}) {
  const [marginBottom, setMarginBottom] = useState(`${marginHeight}rem`);
  const SubjectTitleRef = useRef(null);

  useEffect(() => {
    const numLines = SubjectTitleRef.current.clientHeight / subjectTitleHeight;
    setMarginBottom(`${numLines * marginHeight}rem`);
  });

  let buttons = [];
  if (numMsgs > 0) {
    buttons.push({
      color: 'logoBlue',
      opacity: 0.5,
      onClick: showMsgsModal,
      label: 'View',
      onHover: false
    });
  }
  if (currentSubjectId !== id) {
    buttons.push({
      color: 'green',
      opacity: 0.5,
      onClick: selectSubject,
      label: 'Select',
      onHover: false
    });
  }
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
          />{' '}
          {numMsgs && numMsgs > 0 && (
            <b style={{ color: Color.blue() }}>({numMsgs})</b>
          )}
          <div>
            <UsernameText
              color={Color.darkerGray()}
              user={{
                id: userId,
                username: username
              }}
            />{' '}
            <small>{moment.unix(timeStamp).format('LLL')}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
