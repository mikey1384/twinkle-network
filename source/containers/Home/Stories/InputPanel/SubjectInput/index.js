import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadFeedContent } from 'redux/actions/FeedActions';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Textarea from 'components/Texts/Textarea';
import AttachContentModal from './AttachContentModal';
import Attachment from './Attachment';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import {
  addEmoji,
  exceedsCharLimit,
  stringIsEmpty,
  finalizeEmoji
} from 'helpers/stringHelpers';
import SwitchButton from 'components/SwitchButton';
import RewardLevelForm from 'components/Forms/RewardLevelForm';
import { Color } from 'constants/css';
import { PanelStyle } from '../Styles';
import { charLimit } from 'constants/defaultValues';
import { uploadContent } from 'helpers/requestHelpers';
import { Context } from 'context';

SubjectInput.propTypes = {
  canEditRewardLevel: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  uploadFeedContent: PropTypes.func.isRequired
};

function SubjectInput({ canEditRewardLevel, dispatch, uploadFeedContent }) {
  const [attachContentModalShown, setAttachContentModalShown] = useState(false);
  const {
    input: {
      state: { subject },
      dispatch: inputDispatch
    }
  } = useContext(Context);
  const {
    attachment,
    descriptionInputShown,
    details: { title, description, secretAnswer, rewardLevel },
    hasSecretAnswer
  } = subject;
  const [submitting, setSubmitting] = useState(false);
  const titleExceedsCharLimit = exceedsCharLimit({
    inputType: 'title',
    contentType: 'subject',
    text: title
  });
  const descriptionExceedsCharLimit = exceedsCharLimit({
    contentType: 'subject',
    inputType: 'description',
    text: description
  });
  const secretAnswerExceedsCharLimit = exceedsCharLimit({
    contentType: 'subject',
    inputType: 'description',
    text: secretAnswer
  });

  return (
    <ErrorBoundary className={PanelStyle}>
      <p>Post a subject Twinkle users can talk about</p>
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ width: '100%' }}>
          <Input
            placeholder="A subject Twinkle users can talk about"
            value={title}
            onChange={onInputChange}
            onKeyUp={event => {
              inputDispatch({
                type: 'SET_SUBJECT_TITLE',
                title: addEmoji(event.target.value)
              });
            }}
            style={titleExceedsCharLimit?.style}
          />
        </div>
        <div style={{ marginLeft: '1rem' }}>
          {attachment ? (
            <Attachment
              attachment={attachment}
              onClose={() =>
                inputDispatch({
                  type: 'SET_SUBJECT_ATTACHMENT',
                  attachment: undefined
                })
              }
            />
          ) : (
            <Button
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.5rem',
                padding: '0.5rem'
              }}
              skeuomorphic
              color="darkerGray"
              onClick={() => setAttachContentModalShown(true)}
            >
              Attach Video or Webpage
            </Button>
          )}
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <span
          style={{
            fontSize: '1.2rem',
            color:
              title.length > charLimit.subject.title
                ? 'red'
                : Color.darkerGray()
          }}
        >
          {titleExceedsCharLimit?.message}
        </span>
      </div>
      {descriptionInputShown && (
        <div style={{ position: 'relative' }}>
          <Textarea
            type="text"
            style={{
              marginTop: '1rem',
              ...(descriptionExceedsCharLimit?.style || null)
            }}
            value={description}
            minRows={4}
            placeholder="Enter Description (Optional, you don't need to write this)"
            onChange={event =>
              inputDispatch({
                type: 'SET_SUBJECT_DESCRIPTION',
                description: addEmoji(event.target.value)
              })
            }
            onKeyUp={event => {
              if (event.key === ' ') {
                inputDispatch({
                  type: 'SET_SUBJECT_DESCRIPTION',
                  description: addEmoji(event.target.value)
                });
              }
            }}
          />
          {descriptionExceedsCharLimit && (
            <small style={{ color: 'red' }}>
              {descriptionExceedsCharLimit.message}
            </small>
          )}
          {hasSecretAnswer && (
            <div style={{ marginTop: '0.5rem' }}>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  color: Color.darkerGray()
                }}
              >
                Secret Message
              </span>
              <Textarea
                autoFocus
                type="text"
                style={{
                  marginTop: '0.5rem',
                  ...(secretAnswerExceedsCharLimit || null)
                }}
                value={secretAnswer}
                minRows={4}
                placeholder="Enter the Secret Message"
                onChange={event =>
                  inputDispatch({
                    type: 'SET_SECRET_ANSWER',
                    secretAnswer: addEmoji(event.target.value)
                  })
                }
                onKeyUp={event => {
                  if (event.key === ' ') {
                    inputDispatch({
                      type: 'SET_SECRET_ANSWER',
                      secretAnswer: addEmoji(event.target.value)
                    });
                  }
                }}
              />
              {secretAnswerExceedsCharLimit && (
                <small style={{ color: 'red' }}>
                  {secretAnswerExceedsCharLimit.message}
                </small>
              )}
            </div>
          )}
          {canEditRewardLevel && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>
                For every star you add, the amount of maximum XP you and other
                moderators could reward the participants of this subject rises
                by 1,000 XP.
              </div>
              <RewardLevelForm
                themed
                style={{
                  marginTop: '1rem',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  padding: '1rem',
                  fontSize: '3rem'
                }}
                rewardLevel={rewardLevel}
                onSetRewardLevel={rewardLevel =>
                  inputDispatch({
                    type: 'SET_SUBJECT_REWARD_LEVEL',
                    rewardLevel
                  })
                }
              />
            </div>
          )}
          <div style={{ marginTop: '1rem' }} className="button-container">
            <SwitchButton
              checked={hasSecretAnswer}
              label="Secret Message"
              onChange={() =>
                inputDispatch({
                  type: 'SET_HAS_SECRET_ANSWER',
                  hasSecretAnswer: !hasSecretAnswer
                })
              }
              style={{ marginRight: '1rem' }}
            />
            <Button
              filled
              color="green"
              type="submit"
              disabled={submitting || buttonDisabled()}
              onClick={onSubmit}
            >
              Post!
            </Button>
          </div>
        </div>
      )}
      {attachContentModalShown && (
        <AttachContentModal
          onHide={() => setAttachContentModalShown(false)}
          onConfirm={content => {
            inputDispatch({
              type: 'SET_SUBJECT_ATTACHMENT',
              attachment: content
            });
            setAttachContentModalShown(false);
          }}
        />
      )}
    </ErrorBoundary>
  );

  function buttonDisabled() {
    if (title.length > charLimit.subject.title) return true;
    if (description.length > charLimit.subject.description) return true;
    if (
      (hasSecretAnswer && stringIsEmpty(secretAnswer)) ||
      secretAnswer.length > charLimit.subject.description
    ) {
      return true;
    }
    return false;
  }

  function onInputChange(text) {
    inputDispatch({
      type: 'SET_SUBJECT_TITLE',
      title: text
    });
    inputDispatch({
      type: 'SET_SUBJECT_DESCRIPTION_INPUT_SHOWN',
      shown: !!text.length
    });
    if (!text.length) {
      inputDispatch({
        type: 'SET_HAS_SECRET_ANSWER',
        hasSecretAnswer: false
      });
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (
      stringIsEmpty(title) ||
      title.length > charLimit.subject.title ||
      (hasSecretAnswer && stringIsEmpty(secretAnswer))
    ) {
      return;
    }
    setSubmitting(true);
    try {
      const data = await uploadContent({
        attachment,
        title,
        description: finalizeEmoji(description),
        secretAnswer: hasSecretAnswer ? secretAnswer : '',
        rewardLevel,
        dispatch
      });
      uploadFeedContent(data);
      inputDispatch({
        type: 'RESET_SUBJECT_INPUT'
      });
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }
}

export default connect(
  state => ({
    canEditRewardLevel: state.UserReducer.canEditRewardLevel
  }),
  dispatch => ({
    dispatch,
    uploadFeedContent: params => dispatch(uploadFeedContent(params))
  })
)(SubjectInput);
