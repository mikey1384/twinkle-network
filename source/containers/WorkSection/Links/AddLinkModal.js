import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { uploadLink } from 'redux/actions/LinkActions';
import { connect } from 'react-redux';
import Input from 'components/Texts/Input';
import Banner from 'components/Banner';
import {
  exceedsCharLimit,
  isValidUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';

AddLinkModal.propTypes = {
  onHide: PropTypes.func,
  uploadLink: PropTypes.func
};

function AddLinkModal({ onHide, uploadLink }) {
  const [urlError, setUrlError] = useState('');
  const [form, setForm] = useState({
    url: '',
    title: '',
    description: ''
  });
  const UrlFieldRef = useRef(null);

  return (
    <Modal onHide={onHide}>
      <header>Add Links</header>
      <main>
        {urlError && (
          <Banner style={{ marginBottom: '1rem' }} love>
            {urlError}
          </Banner>
        )}
        <Input
          inputRef={UrlFieldRef}
          style={urlHasError()}
          value={form.url}
          onChange={handleUrlFieldChange}
          placeholder="Paste the Link's Internet Address (URL) here"
          type="text"
        />
        <Input
          style={{ marginTop: '1rem', ...(titleExceedsCharLimit() || {}) }}
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
        />
        {titleExceedsCharLimit() && (
          <small style={{ color: 'red', width: '100%' }}>
            {renderCharLimit({
              contentType: 'url',
              inputType: 'title',
              text: form.title
            })}
          </small>
        )}
        <Textarea
          style={{
            marginTop: '1rem',
            ...(descriptionExceedsCharLimit() || {})
          }}
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
        />
        {descriptionExceedsCharLimit() && (
          <small style={{ color: 'red', width: '100%' }}>
            {renderCharLimit({
              contentType: 'url',
              inputType: 'description',
              text: form.description
            })}
          </small>
        )}
      </main>
      <footer>
        <Button onClick={onHide} transparent style={{ marginRight: '0.7rem' }}>
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
    const { url, title, description } = form;
    event.preventDefault();
    if (!isValidUrl(url)) {
      setUrlError('That is not a valid url');
      return UrlFieldRef.current.focus();
    }
    await uploadLink({
      url,
      title: finalizeEmoji(title),
      description: finalizeEmoji(description)
    });
    onHide();
  }

  function handleUrlFieldChange(text) {
    setForm({
      ...form,
      url: text
    });
    setUrlError('');
  }

  function submitDisabled() {
    const { url, title } = form;
    if (stringIsEmpty(url)) return true;
    if (stringIsEmpty(title)) return true;
    if (urlHasError()) return true;
    if (titleExceedsCharLimit()) return true;
    if (descriptionExceedsCharLimit()) return true;
    return false;
  }

  function urlHasError() {
    if (urlError) {
      return {
        color: 'red',
        borderColor: 'red'
      };
    }
    return urlExceedsCharLimit();
  }

  function descriptionExceedsCharLimit() {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'description',
      text: form.description
    });
  }

  function titleExceedsCharLimit() {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'title',
      text: form.title
    });
  }

  function urlExceedsCharLimit() {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'url',
      text: form.url
    });
  }
}

export default connect(
  null,
  { uploadLink: uploadLink }
)(AddLinkModal);
