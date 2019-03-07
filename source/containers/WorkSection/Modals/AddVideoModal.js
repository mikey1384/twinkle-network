import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { uploadContent } from 'helpers/requestHelpers';
import { uploadVideo } from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import Input from 'components/Texts/Input';
import {
  exceedsCharLimit,
  isValidYoutubeUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';

AddVideoModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  focusVideoPanelAfterUpload: PropTypes.func.isRequired,
  uploadVideo: PropTypes.func.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string
};

function AddVideoModal({
  dispatch,
  focusVideoPanelAfterUpload,
  onHide,
  uploadVideo,
  userId,
  username
}) {
  const [urlError, setUrlError] = useState('');
  const [form, setForm] = useState({
    url: '',
    title: '',
    description: ''
  });
  const [disabled, setDisabled] = useState(false);
  const { url, title, description } = form;
  const UrlFieldRef = useRef(null);
  const titleExceedsCharLimit = exceedsCharLimit({
    inputType: 'title',
    contentType: 'video',
    text: title
  });
  const descriptionExceedsCharLimit = exceedsCharLimit({
    inputType: 'description',
    contentType: 'video',
    text: description
  });

  return (
    <Modal onHide={onHide}>
      <header>Add Videos</header>
      <main>
        <form style={{ width: '100%' }}>
          <section>
            <Input
              inputRef={UrlFieldRef}
              value={form.url}
              onChange={handleUrlFieldChange}
              placeholder="Paste video's YouTube url here"
              type="text"
              style={urlHasError()}
            />
            {urlError && (
              <span
                style={{
                  color: 'red',
                  lineHeight: '3rem',
                  marginBottom: '0px'
                }}
              >
                {urlError}
              </span>
            )}
          </section>
          <section style={{ marginTop: '1rem' }}>
            <Input
              value={form.title}
              onChange={text => setForm({ ...form, title: text })}
              placeholder="Enter Title"
              type="text"
              onKeyUp={event => {
                if (event.key === ' ') {
                  setForm({
                    ...form,
                    title: addEmoji(event.target.value)
                  });
                }
              }}
              style={titleExceedsCharLimit}
            />
            {titleExceedsCharLimit && (
              <small style={{ color: 'red' }}>
                {renderCharLimit({
                  contentType: 'video',
                  inputType: 'title',
                  text: title
                })}
              </small>
            )}
          </section>
          <section style={{ marginTop: '1rem', position: 'relative' }}>
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
              style={descriptionExceedsCharLimit}
            />
            {descriptionExceedsCharLimit && (
              <small style={{ color: 'red' }}>
                {renderCharLimit({
                  contentType: 'video',
                  inputType: 'description',
                  text: description
                })}
              </small>
            )}
          </section>
        </form>
      </main>
      <footer>
        <Button style={{ marginRight: '0.7rem' }} transparent onClick={onHide}>
          Cancel
        </Button>
        <Button
          primary
          type="submit"
          onClick={handleSubmit}
          disabled={submitDisabled()}
        >
          Add
        </Button>
      </footer>
    </Modal>
  );

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isValidYoutubeUrl(url)) {
      setUrlError('That is not a valid YouTube url');
      return UrlFieldRef.current.focus();
    }
    setDisabled(true);
    const data = await uploadContent({
      url,
      isVideo: true,
      title: finalizeEmoji(title),
      description: finalizeEmoji(description),
      dispatch
    });
    uploadVideo({
      id: data.contentId,
      title,
      content: data.content,
      uploader: {
        id: userId,
        username
      }
    });
    focusVideoPanelAfterUpload();
  }

  function handleUrlFieldChange(text) {
    setForm({ ...form, url: text });
    setUrlError('');
  }

  function submitDisabled() {
    if (disabled) return true;
    if (stringIsEmpty(url) || stringIsEmpty(title)) return true;
    if (urlHasError()) return true;
    if (
      exceedsCharLimit({
        inputType: 'description',
        contentType: 'video',
        text: description
      })
    ) {
      return true;
    }
    return false;
  }

  function urlHasError() {
    if (urlError) return { color: 'red', borderColor: 'red' };
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'url',
      text: url
    });
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username
  }),
  dispatch => ({
    dispatch,
    uploadVideo: params => dispatch(uploadVideo(params))
  })
)(AddVideoModal);
