import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { scrollElementToCenter } from 'helpers';
import {
  exceedsCharLimit,
  isValidUrl,
  isValidYoutubeUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers';
import { PanelStyle } from './Styles';
import { css } from 'emotion';
import { uploadFeedContent } from 'redux/actions/FeedActions';
import { checkIfContentExists, uploadContent } from 'helpers/requestHelpers';
import { Context } from 'context';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Banner from 'components/Banner';
import RewardLevelForm from 'components/Forms/RewardLevelForm';
import Link from 'components/Link';
import Checkbox from 'components/Checkbox';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';

ContentInput.propTypes = {
  canEditRewardLevel: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  uploadFeedContent: PropTypes.func.isRequired
};

function ContentInput({ canEditRewardLevel, dispatch, uploadFeedContent }) {
  const {
    input: {
      state: { content },
      dispatch: inputDispatch
    }
  } = useContext(Context);
  const {
    alreadyPosted,
    descriptionFieldShown,
    form,
    titleFieldShown,
    urlHelper,
    urlError
  } = content;
  const [submitting, setSubmitting] = useState(false);
  const UrlFieldRef = useRef(null);
  const checkContentExistsTimerRef = useRef(null);
  const showHelperMessageTimerRef = useRef(null);
  const descriptionExceedsCharLimit = exceedsCharLimit({
    inputType: 'description',
    contentType: form.isVideo ? 'video' : 'url',
    text: form.description
  });
  const titleExceedsCharLimit = exceedsCharLimit({
    inputType: 'title',
    contentType: form.isVideo ? 'video' : 'url',
    text: form.title
  });

  return (
    <ErrorBoundary className={PanelStyle}>
      <p>Share interesting videos or webpages</p>
      {urlError && (
        <Banner color="pink" style={{ marginBottom: '1rem' }}>
          {urlError}
        </Banner>
      )}
      <Input
        inputRef={UrlFieldRef}
        style={errorInUrlField()}
        value={form.url}
        onChange={onUrlFieldChange}
        placeholder="Copy and paste a URL address here"
        type="text"
      />
      {alreadyPosted && (
        <div style={{ fontSize: '1.6rem', marginTop: '0.5rem' }}>
          This content has{' '}
          <Link
            style={{ fontWeight: 'bold' }}
            to={`/${alreadyPosted.type === 'url' ? 'link' : 'video'}s/${
              alreadyPosted.id
            }`}
          >
            already been posted before
          </Link>
        </div>
      )}
      <Checkbox
        label={'YouTube Video:'}
        onClick={() => {
          inputDispatch({
            type: 'SET_IS_VIDEO',
            isVideo: !form.isVideo
          });
          inputDispatch({
            type: 'SET_URL_ERROR',
            urlError: ''
          });
        }}
        style={{ marginTop: '1rem' }}
        checked={form.isVideo}
      />
      {!stringIsEmpty(urlHelper) && (
        <span
          style={{
            fontSize: '1.7rem',
            marginTop: '1rem',
            display: 'block'
          }}
          className={css`
            > a {
              font-weight: bold;
            }
          `}
          dangerouslySetInnerHTML={{
            __html: urlHelper
          }}
        />
      )}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          {titleFieldShown && (
            <>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '2rem'
                }}
              >
                Title:
              </span>
              <Input
                value={form.title}
                onChange={text =>
                  inputDispatch({
                    type: 'SET_CONTENT_TITLE',
                    title: text
                  })
                }
                placeholder="Enter Title Here"
                onKeyUp={event => {
                  if (event.key === ' ') {
                    inputDispatch({
                      type: 'SET_CONTENT_TITLE',
                      title: addEmoji(event.target.value)
                    });
                  }
                }}
                style={{
                  ...(titleExceedsCharLimit?.style || {})
                }}
                type="text"
              />
              {titleExceedsCharLimit && (
                <small style={{ color: 'red' }}>
                  {titleExceedsCharLimit.message}
                </small>
              )}
            </>
          )}
          {descriptionFieldShown && (
            <>
              <Textarea
                value={form.description}
                minRows={4}
                placeholder="Enter Description (Optional, you don't need to write this)"
                onChange={event =>
                  inputDispatch({
                    type: 'SET_CONTENT_DESCRIPTION',
                    description: event.target.value
                  })
                }
                onKeyUp={event => {
                  if (event.key === ' ') {
                    inputDispatch({
                      type: 'SET_CONTENT_DESCRIPTION',
                      description: addEmoji(event.target.value)
                    });
                  }
                }}
                style={{
                  marginTop: '1rem',
                  ...(descriptionExceedsCharLimit?.style || {})
                }}
              />
              {descriptionExceedsCharLimit && (
                <small style={{ color: 'red' }}>
                  {descriptionExceedsCharLimit?.message}
                </small>
              )}
            </>
          )}
        </div>
        {!buttonDisabled() && !urlHelper && form.isVideo && canEditRewardLevel && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '1.5rem' }}>
              For every star you add, the amount of XP gained by the viewers of
              this video rises by 200 XP. Please consider both difficulty and
              educational importance of your video when setting the reward
              level.
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
              rewardLevel={form.rewardLevel}
              onSetRewardLevel={rewardLevel =>
                inputDispatch({
                  type: 'SET_CONTENT_REWARD_LEVEL',
                  rewardLevel
                })
              }
            />
          </div>
        )}
        {descriptionFieldShown && (
          <div className="button-container">
            <Button
              type="submit"
              filled
              color="green"
              style={{ marginTop: '1rem' }}
              disabled={submitting || buttonDisabled()}
              onClick={onSubmit}
            >
              Share!
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );

  function buttonDisabled() {
    const { url, title } = form;
    if (stringIsEmpty(url) || stringIsEmpty(title)) return true;
    if (errorInUrlField()) return true;
    if (titleExceedsCharLimit) return true;
    if (descriptionExceedsCharLimit) return true;
    return false;
  }

  function errorInUrlField() {
    const { isVideo, url } = form;
    if (urlError) return { borderColor: 'red', color: 'red' };
    return exceedsCharLimit({
      inputType: 'url',
      contentType: isVideo ? 'video' : 'url',
      text: url
    })?.style;
  }

  async function onSubmit(event) {
    const { url, isVideo } = form;
    let urlError;
    event.preventDefault();
    if (!isValidUrl(url)) urlError = 'That is not a valid url';
    if (isVideo && !isValidYoutubeUrl(url)) {
      urlError = 'That is not a valid YouTube url';
    }
    if (urlError) {
      inputDispatch({
        type: 'SET_URL_ERROR',
        urlError
      });
      UrlFieldRef.current.focus();
      return scrollElementToCenter(UrlFieldRef.current);
    }
    setSubmitting(true);
    try {
      const data = await uploadContent({
        ...form,
        title: finalizeEmoji(form.title),
        description: finalizeEmoji(form.description),
        dispatch
      });
      inputDispatch({
        type: 'RESET_CONTENT_INPUT'
      });
      setSubmitting(false);
      uploadFeedContent(data);
      document.getElementById('App').scrollTop = 0;
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }

  function onUrlFieldChange(url) {
    clearTimeout(checkContentExistsTimerRef.current);
    clearTimeout(showHelperMessageTimerRef.current);
    const urlIsValid = isValidUrl(url);
    inputDispatch({
      type: 'SET_ALREADY_POSTED',
      alreadyPosted: false
    });
    inputDispatch({
      type: 'SET_CONTENT_URL',
      url
    });
    inputDispatch({
      type: 'SET_IS_VIDEO',
      isVideo: isValidYoutubeUrl(url)
    });
    inputDispatch({
      type: 'SET_CONTENT_TITLE_FIELD_SHOWN',
      shown: urlIsValid
    });
    inputDispatch({
      type: 'SET_CONTENT_DESCRIPTION_FIELD_SHOWN',
      shown: urlIsValid
    });
    inputDispatch({
      type: 'SET_URL_ERROR',
      urlError: ''
    });
    inputDispatch({
      type: 'SET_URL_HELPER',
      urlHelper: ''
    });
    if (urlIsValid) {
      checkContentExistsTimerRef.current = setTimeout(
        () => handleCheckIfContentExists(url),
        300
      );
    }
    showHelperMessageTimerRef.current = setTimeout(() => {
      inputDispatch({
        type: 'SET_URL_HELPER',
        urlHelper:
          urlIsValid || stringIsEmpty(url)
            ? ''
            : `A URL is a website's internet address. Twinkle Network's URL is <a href="https://www.twin-kle.com" target="_blank">www.twin-kle.com</a> and <a href="https://www.twinkle.network" target="_blank">www.twinkle.network</a>. You can find a webpage's URL at the <b>top area of your browser</b>. Copy a URL you want to share and paste it to the box above.`
      });
      const regex = /\b(http[s]?(www\.)?|ftp:\/\/(www\.)?|www\.){1}/gi;
      inputDispatch({
        type: 'SET_CONTENT_TITLE',
        title:
          !urlIsValid &&
          !stringIsEmpty(url) &&
          url.length > 3 &&
          !regex.test(url)
            ? url
            : form.title
      });
      inputDispatch({
        type: 'SET_CONTENT_TITLE_FIELD_SHOWN',
        shown: !stringIsEmpty(url)
      });
    }, 300);
  }

  async function handleCheckIfContentExists(url) {
    const isVideo = isValidYoutubeUrl(url);
    const { exists, content } = await checkIfContentExists({
      url,
      type: isVideo ? 'video' : 'url'
    });
    return inputDispatch({
      type: 'SET_ALREADY_POSTED',
      alreadyPosted: exists ? content : false
    });
  }
}

export default connect(
  state => ({
    canEditRewardLevel: state.UserReducer.canEditRewardLevel,
    username: state.UserReducer.username,
    profileTheme: state.UserReducer.profileTheme
  }),
  dispatch => ({
    dispatch,
    uploadFeedContent: params => dispatch(uploadFeedContent(params))
  })
)(ContentInput);
