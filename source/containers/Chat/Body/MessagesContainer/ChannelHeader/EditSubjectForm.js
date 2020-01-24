import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
  cleanString,
  addEmoji,
  finalizeEmoji,
  trimWhiteSpaces
} from 'helpers/stringHelpers';
import { useOutsideClick } from 'helpers/hooks';
import SearchDropdown from 'components/SearchDropdown';
import Button from 'components/Button';
import { Color } from 'constants/css';
import { timeSince } from 'helpers/timeStampHelpers';
import SubjectsModal from '../../../Modals/SubjectsModal';
import Input from 'components/Texts/Input';
import ErrorBoundary from 'components/ErrorBoundary';
import { edit } from 'constants/placeholders';
import { css } from 'emotion';

EditSubjectForm.propTypes = {
  autoFocus: PropTypes.bool,
  currentSubjectId: PropTypes.number,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onClickOutSide: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  reloadChatSubject: PropTypes.func,
  searchResults: PropTypes.array,
  title: PropTypes.string.isRequired
};

export default function EditSubjectForm({
  autoFocus,
  currentSubjectId,
  reloadChatSubject,
  maxLength = 100,
  searchResults,
  onChange,
  onClickOutSide,
  ...props
}) {
  const [exactMatchExists, setExactMatchExists] = useState(false);
  const [title, setTitle] = useState(cleanString(props.title));
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [readyForSubmit, setReadyForSubmit] = useState(false);
  const [subjectsModalShown, setSubjectsModalShown] = useState(false);
  const EditSubjectFormRef = useRef(null);
  const timerRef = useRef(null);
  useOutsideClick(EditSubjectFormRef, () => {
    if (!subjectsModalShown) onClickOutSide();
  });

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => changeInput(title), 300);
    async function changeInput(input) {
      await onChange(input);
      const content = input ? `${input[0].toUpperCase()}${input.slice(1)}` : '';
      for (let i = 0; i < searchResults.length; i++) {
        if (content === searchResults[i].content) {
          setExactMatchExists(true);
          break;
        }
      }
      setReadyForSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return (
    <ErrorBoundary>
      {subjectsModalShown && (
        <SubjectsModal
          currentSubjectId={currentSubjectId}
          onHide={() => setSubjectsModalShown(false)}
          selectSubject={subjectId => {
            reloadChatSubject(subjectId);
            setSubjectsModalShown(false);
          }}
        />
      )}
      <div ref={EditSubjectFormRef} style={{ width: '100%' }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
          className={css`
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
          `}
        >
          <div style={{ width: '100%' }}>
            <form
              style={{
                width: '100%',
                position: 'relative',
                marginTop: '1.5rem'
              }}
              onSubmit={onEditSubmit}
            >
              <Input
                autoFocus={autoFocus}
                placeholder={edit.subject}
                value={title}
                onChange={onInputChange}
                onKeyUp={event => setTitle(addEmoji(event.target.value))}
                onKeyDown={onKeyDown}
              />
              {searchResults.length > 0 && (
                <SearchDropdown
                  onUpdate={onUpdate}
                  onItemClick={onItemClick}
                  renderItemLabel={renderItemLabel}
                  startingIndex={-1}
                  style={{ width: '100%' }}
                  indexToHighlight={highlightedIndex}
                  searchResults={searchResults}
                />
              )}
            </form>
          </div>
          <div
            style={{
              marginTop: '1.7rem',
              marginLeft: '1rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Button
              style={{ fontSize: '1.3rem' }}
              filled
              color="green"
              onClick={() => setSubjectsModalShown(true)}
            >
              View Subjects
            </Button>
          </div>
        </div>
        <div style={{ background: '#fff' }}>
          <small style={{ color: title.length > maxLength && 'red' }}>
            {title.length}/{maxLength} Characters
          </small>
          {title.length <= maxLength && (
            <small>
              {' '}
              (Press <b>Enter</b> to Apply)
            </small>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );

  function onKeyDown(event) {
    let index = highlightedIndex;
    if (searchResults.length > 0 && !exactMatchExists) {
      if (event.keyCode === 40) {
        event.preventDefault();
        setHighlightedIndex(Math.min(++index, searchResults.length - 1));
      }
      if (event.keyCode === 38) {
        event.preventDefault();
        setHighlightedIndex(Math.max(--index, -1));
      }
    }
  }

  function onInputChange(text) {
    setTitle(text);
    setReadyForSubmit(false);
    setHighlightedIndex(-1);
    setExactMatchExists(false);
  }

  function onUpdate() {
    let text = title ? `${title[0].toUpperCase()}${title.slice(1)}` : '';
    for (let i = 0; i < searchResults.length; i++) {
      if (text === searchResults[i].content) {
        setExactMatchExists(true);
        return setHighlightedIndex(i);
      }
    }
    setHighlightedIndex(-1);
  }

  function onEditSubmit(event) {
    event.preventDefault();
    if (!readyForSubmit) return;
    if (highlightedIndex > -1) {
      const { id: subjectId } = searchResults[highlightedIndex];
      if (subjectId === currentSubjectId) return onClickOutSide();
      return reloadChatSubject(subjectId);
    }

    if (title && title.length > maxLength) return;
    if (
      title &&
      trimWhiteSpaces(`${title[0].toUpperCase()}${title.slice(1)}`) !==
        props.title
    ) {
      props.onEditSubmit(finalizeEmoji(title));
    } else {
      onClickOutSide();
    }
  }

  function onItemClick(item) {
    const { id: subjectId } = item;
    if (subjectId === currentSubjectId) return onClickOutSide();
    return reloadChatSubject(subjectId);
  }

  function renderItemLabel(item) {
    return (
      <div>
        <div
          style={{
            color: Color.green(),
            fontWeight: 'bold'
          }}
        >
          {cleanString(item.content)}
          <span style={{ color: Color.blue() }}>
            {Number(item.numMsgs) > 0 && ` (${item.numMsgs})`}
          </span>
        </div>
        <div>
          <small>
            Posted by <b>{item.username}</b> ({timeSince(item.timeStamp)})
          </small>
        </div>
      </div>
    );
  }
}
