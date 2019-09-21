import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  exceedsCharLimit,
  isValidYoutubeUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers';
import Textarea from 'components/Texts/Textarea';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import RewardLevelForm from 'components/Forms/RewardLevelForm';
import { uploadVideo } from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import { useAppContext } from 'context';

AddVideoModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  focusVideoPanelAfterUpload: PropTypes.func.isRequired,
  uploadVideo: PropTypes.func.isRequired
};

function AddVideoModal({ focusVideoPanelAfterUpload, onHide, uploadVideo }) {
  const {
    user: {
      state: { canEditRewardLevel, userId, username }
    },
    requestHelpers: { uploadContent }
  } = useAppContext();
  const [urlError, setUrlError] = useState('');
  const [form, setForm] = useState({
    url: '',
    title: '',
    description: '',
    rewardLevel: 0
  });
  const [disabled, setDisabled] = useState(false);
  const { url, title, description, rewardLevel } = form;
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
  const urlExceedsCharLimit = exceedsCharLimit({
    contentType: 'video',
    inputType: 'url',
    text: url
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
              onKeyUp={event => {
                if (event.key === ' ') {
                  setForm({
                    ...form,
                    title: addEmoji(event.target.value)
                  });
                }
              }}
              style={titleExceedsCharLimit?.style}
            />
            {titleExceedsCharLimit && (
              <small style={{ color: 'red' }}>
                {titleExceedsCharLimit?.message}
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
              style={descriptionExceedsCharLimit?.style}
            />
            {descriptionExceedsCharLimit && (
              <small style={{ color: 'red' }}>
                {descriptionExceedsCharLimit?.message}
              </small>
            )}
          </section>
          {canEditRewardLevel && (
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
                setForm(form => ({
                  ...form,
                  rewardLevel
                }))
              }
            />
          )}
        </form>
      </main>
      <footer>
        <Button style={{ marginRight: '0.7rem' }} transparent onClick={onHide}>
          Cancel
        </Button>
        <Button
          color="blue"
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
      rewardLevel
    });
    uploadVideo({
      id: data.contentId,
      title,
      content: data.content,
      rewardLevel,
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
    if (descriptionExceedsCharLimit) {
      return true;
    }
    return false;
  }

  function urlHasError() {
    if (urlError) return { color: 'red', borderColor: 'red' };
    return urlExceedsCharLimit?.style;
  }
}

export default connect(
  null,
  { uploadVideo }
)(AddVideoModal);
