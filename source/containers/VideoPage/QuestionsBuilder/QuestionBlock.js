import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ChoiceListItem from './ChoiceListItem';
import EditChoiceListItem from './EditChoiceListItem';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import { cleanString } from 'helpers/stringHelpers';
import { borderRadius, innerBorderRadius, Color } from 'constants/css';
import Banner from 'components/Banner';
import Icon from 'components/Icon';
import { css } from 'emotion';

const Styles = {
  content: css`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  `,
  choiceList: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    > nav {
      display: flex;
      width: 100%;
      border: 1px solid ${Color.borderGray()};
      margin-bottom: -1px;
      > main {
        position: relative;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        width: CALC(100% - 4.3rem);
        > section {
          padding: 0.5rem;
          width: 100%;
          line-height: 1.5;
          display: flex;
        }
      }
      > aside {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.5rem;
        background: ${Color.darkerBorderGray()};
      }
      &:first-of-type {
        border-top-left-radius: ${borderRadius};
        border-top-right-radius: ${borderRadius};
        > aside {
          border-top-right-radius: ${innerBorderRadius};
        }
      }
      &:last-child {
        border-bottom-left-radius: ${borderRadius};
        border-bottom-right-radius: ${borderRadius};
        > aside {
          border-bottom-right-radius: ${innerBorderRadius};
        }
      }
    }
  `
};

QuestionBlock.propTypes = {
  choiceIds: PropTypes.array.isRequired,
  choicesObj: PropTypes.object.isRequired,
  correctChoice: PropTypes.number,
  deleted: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  questionId: PropTypes.number.isRequired,
  innerRef: PropTypes.func.isRequired,
  onEdit: PropTypes.bool.isRequired,
  onEditCancel: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  onEditStart: PropTypes.func.isRequired,
  onRearrange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelectChoice: PropTypes.func.isRequired,
  hideErrorMsg: PropTypes.func.isRequired,
  onUndoRemove: PropTypes.func.isRequired,
  questionIndex: PropTypes.number.isRequired,
  title: PropTypes.string
};

export default function QuestionBlock({
  correctChoice,
  choiceIds,
  choicesObj: initialChoices,
  deleted,
  errorMessage,
  hideErrorMsg,
  questionId,
  innerRef,
  onEditDone,
  onSelectChoice,
  onRearrange,
  onEdit,
  onEditCancel,
  onEditStart,
  onRemove,
  onUndoRemove,
  questionIndex,
  title
}) {
  const [editedQuestionTitle, setEditedQuestionTitle] = useState('');
  const [choices, setChoices] = useState({});

  useEffect(() => {
    setEditedQuestionTitle(title);
    setChoices(initialChoices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialChoices]);

  const choicePlaceHolder = [
    'Choice A',
    'Choice B',
    'Choice C (Optional)',
    'Choice D (Optional)',
    'Choice E (Optional)'
  ];

  return (
    <div
      style={{
        marginTop: questionIndex === 0 ? 0 : '2rem'
      }}
    >
      <Banner
        color="red"
        innerRef={innerRef}
        style={{
          width: '100%',
          display: errorMessage ? 'block' : 'none',
          marginBottom: '1rem'
        }}
      >
        {errorMessage}
      </Banner>
      <div className={Styles.content}>
        <div style={{ width: onEdit ? '100%' : 'auto', position: 'relative' }}>
          {!onEdit ? (
            <h2
              style={{
                opacity: deleted && '0.2',
                color: !title && '#999'
              }}
            >
              {title || 'Question Title'}
            </h2>
          ) : (
            <Textarea
              autoFocus
              placeholder="Enter Question..."
              value={cleanString(editedQuestionTitle)}
              onChange={event => {
                hideErrorMsg(questionId);
                setEditedQuestionTitle(event.target.value);
              }}
            />
          )}
        </div>
        <div>
          {!onEdit && !deleted && (
            <Button color="pink" filled onClick={() => onRemove(questionId)}>
              Remove
            </Button>
          )}
          {deleted && (
            <Button
              skeuomorphic
              color="darkerGray"
              onClick={() => onUndoRemove(questionId)}
            >
              Undo
            </Button>
          )}
        </div>
      </div>
      <div className={Styles.choiceList} style={{ opacity: deleted && '0.2' }}>
        {choiceIds.map((choiceId, index) => {
          return onEdit ? (
            <EditChoiceListItem
              key={choiceId}
              choiceId={choiceId}
              checked={correctChoice === choiceId}
              onEdit={handleEditChoice}
              onSelect={() => onSelectChoice({ questionId, choiceId })}
              placeholder={choicePlaceHolder[index]}
              text={choices[choiceId]}
            />
          ) : (
            <ChoiceListItem
              key={choiceId}
              id={choiceId}
              deleted={deleted}
              questionIndex={questionIndex}
              onMove={({ sourceId, targetId }) =>
                onRearrange({ questionIndex, sourceId, targetId })
              }
              checked={correctChoice === choiceId}
              onSelect={() => onSelectChoice({ questionId, choiceId })}
              label={choices[choiceId]}
              placeholder={choicePlaceHolder[index]}
              checkDisabled={deleted}
            />
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1rem'
        }}
      >
        {!onEdit ? (
          <Button
            transparent
            onClick={() => onEditStart(questionId)}
            style={{ opacity: deleted && '0.2', fontSize: '2rem' }}
            disabled={deleted && true}
          >
            <Icon icon="pencil-alt" />
            <span style={{ marginLeft: '1.2rem' }}>Edit Questions</span>
          </Button>
        ) : (
          <div style={{ display: 'flex' }}>
            <Button transparent onClick={() => handleEditCancel(questionId)}>
              Cancel
            </Button>
            <Button
              color="blue"
              style={{ marginLeft: '1rem' }}
              onClick={handleEditDone}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  function handleEditChoice({ choiceId, text }) {
    hideErrorMsg(questionId);
    setChoices({
      ...choices,
      [choiceId]: text
    });
  }

  function handleEditCancel(questionIndex) {
    hideErrorMsg(questionId);
    setEditedQuestionTitle(title);
    onEditCancel(questionIndex);
  }

  function handleEditDone() {
    hideErrorMsg(questionId);
    onEditDone({ questionId, choices, choiceIds, editedQuestionTitle });
  }
}
