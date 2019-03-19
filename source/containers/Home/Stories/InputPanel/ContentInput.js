import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import { checkIfContentExists, uploadContent } from 'helpers/requestHelpers';
import Input from 'components/Texts/Input';
import { scrollElementToCenter } from 'helpers';
import {
  exceedsCharLimit,
  isValidUrl,
  isValidYoutubeUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  processedStringWithURL,
  renderCharLimit
} from 'helpers/stringHelpers';
import { uploadFeedContent } from 'redux/actions/FeedActions';
import Banner from 'components/Banner';
import { PanelStyle } from './Styles';
import { css } from 'emotion';
import Link from 'components/Link';
import Checkbox from 'components/Checkbox';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';

ContentInput.propTypes = {
  dispatch: PropTypes.func.isRequired,
  uploadFeedContent: PropTypes.func.isRequired
};

function ContentInput({ dispatch, uploadFeedContent }) {
  const [alreadyPosted, setAlreadyPosted] = useState(false);
  const [descriptionFieldShown, setDescriptionFieldShown] = useState(false);
  const [titleFieldShown, setTitleFieldShown] = useState(false);
  const [form, setForm] = useState({
    url: '',
    isVideo: false,
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [urlHelper, setUrlHelper] = useState('');
  const [urlError, setUrlError] = useState('');
  const UrlFieldRef = useRef(null);
  const checkContentExistsTimerRef = useRef(null);
  const showHelperMessageTimerRef = useRef(null);

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
        placeholder="Copy the URL address of a website or a YouTube video and paste it here"
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
          setForm({
            ...form,
            isVideo: !form.isVideo
          });
          setUrlError('');
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
            __html: processedStringWithURL(urlHelper)
          }}
        />
      )}
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ position: 'relative' }}>
          {titleFieldShown && (
            <>
              <Input
                value={form.title}
                onChange={text => setForm({ ...form, title: text })}
                placeholder="Enter Title Here"
                onKeyUp={event => {
                  if (event.key === ' ') {
                    setForm({
                      ...form,
                      title: addEmoji(event.target.value)
                    });
                  }
                }}
                style={{
                  marginTop: '0.5rem',
                  ...titleExceedsCharLimit()
                }}
                type="text"
              />
              {titleExceedsCharLimit() && (
                <small style={{ color: 'red' }}>{renderTitleCharLimit()}</small>
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
                  setForm({ ...form, description: event.target.value })
                }
                onKeyUp={event => {
                  if (event.key === ' ') {
                    setForm({
                      ...form,
                      description: addEmoji(event.target.value)
                    });
                  }
                }}
                style={{
                  marginTop: '1rem',
                  ...(descriptionExceedsCharLimit() || {})
                }}
              />
              {descriptionExceedsCharLimit() && (
                <small style={{ color: 'red' }}>
                  {renderDescriptionCharLimit()}
                </small>
              )}
            </>
          )}
        </div>
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
    if (titleExceedsCharLimit()) return true;
    if (descriptionExceedsCharLimit()) return true;
    return false;
  }

  function errorInUrlField() {
    const { isVideo, url } = form;
    if (urlError) return { borderColor: 'red', color: 'red' };
    return exceedsCharLimit({
      inputType: 'url',
      contentType: isVideo ? 'video' : 'url',
      text: url
    });
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
      setUrlError(urlError);
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
      setAlreadyPosted(false);
      setTitleFieldShown(false);
      setDescriptionFieldShown(false);
      setForm({
        url: '',
        isVideo: false,
        title: '',
        description: ''
      });
      setSubmitting(false);
      setUrlHelper('');
      setUrlError('');
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
    setAlreadyPosted(false);
    setForm({
      ...form,
      url,
      title: !urlIsValid && !stringIsEmpty(url) ? url : form.title,
      isVideo: isValidYoutubeUrl(url)
    });

    setTitleFieldShown(urlIsValid);
    setDescriptionFieldShown(urlIsValid);
    setUrlError('');
    setUrlHelper('');
    if (urlIsValid) {
      checkContentExistsTimerRef.current = setTimeout(
        () => handleCheckIfContentExists(url),
        300
      );
    }
    showHelperMessageTimerRef.current = setTimeout(() => {
      setUrlHelper(
        urlIsValid || stringIsEmpty(url)
          ? ''
          : `You can think of URL as the "address" of a webpage. For example, this webpage's URL is www.twin-kle.com and www.twinkle.network (yes, you can use either one). YouTube's URL is www.youtube.com, and my favorite YouTube video's URL is https://www.youtube.com/watch?v=rf8FX2sI3gU. You can find a webpage's URL at the top area of your browser. Copy a URL you want to share and paste it to the box above.`
      );
      setTitleFieldShown(!stringIsEmpty(url));
    }, 300);
  }

  async function handleCheckIfContentExists(url) {
    const isVideo = isValidYoutubeUrl(url);
    const { exists, content } = await checkIfContentExists({
      url,
      type: isVideo ? 'video' : 'url'
    });
    return setAlreadyPosted(exists ? content : false);
  }

  function renderDescriptionCharLimit() {
    const { isVideo, description } = form;
    return renderCharLimit({
      inputType: 'description',
      contentType: isVideo ? 'video' : 'url',
      text: description
    });
  }

  function renderTitleCharLimit() {
    const { isVideo, title } = form;
    return renderCharLimit({
      inputType: 'title',
      contentType: isVideo ? 'video' : 'url',
      text: title
    });
  }

  function descriptionExceedsCharLimit() {
    const { isVideo, description } = form;
    return exceedsCharLimit({
      inputType: 'description',
      contentType: isVideo ? 'video' : 'url',
      text: description
    });
  }

  function titleExceedsCharLimit() {
    const { isVideo, title } = form;
    return exceedsCharLimit({
      inputType: 'title',
      contentType: isVideo ? 'video' : 'url',
      text: title
    });
  }
}

export default connect(
  state => ({
    username: state.UserReducer.username,
    profileTheme: state.UserReducer.profileTheme
  }),
  dispatch => ({
    dispatch,
    uploadFeedContent: params => dispatch(uploadFeedContent(params))
  })
)(ContentInput);
