import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import {
  isValidEmail,
  isValidUrl,
  isValidYoutubeChannelUrl,
  stringIsEmpty
} from 'helpers/stringHelpers';

export default class InfoEditForm extends Component {
  static propTypes = {
    email: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    website: PropTypes.string,
    youtubeName: PropTypes.string,
    youtubeUrl: PropTypes.string
  };

  timer;

  constructor({ email, website, youtubeName, youtubeUrl }) {
    super();
    this.state = {
      editedEmail: email || '',
      emailError: '',
      editedWebsite: website || '',
      websiteError: '',
      editedYoutubeUrl: youtubeUrl || '',
      youtubeError: '',
      editedYoutubeName: youtubeName || ''
    };
  }

  render() {
    const { onCancel, onSubmit } = this.props;
    const {
      editedEmail,
      emailError,
      editedWebsite,
      editedYoutubeName,
      editedYoutubeUrl,
      websiteError,
      youtubeError
    } = this.state;
    return (
      <div>
        <Input
          maxLength={50}
          placeholder="Email Address"
          onChange={this.onEmailInputChange}
          value={editedEmail}
          style={{ borderColor: emailError && 'red' }}
        />
        {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
        <Input
          maxLength={50}
          placeholder="YouTube Channel URL"
          style={{ marginTop: '1rem', borderColor: youtubeError && 'red' }}
          onChange={this.onYoutubeInputChange}
          value={editedYoutubeUrl}
        />
        {youtubeError && <span style={{ color: 'red' }}>{youtubeError}</span>}
        {!stringIsEmpty(editedYoutubeUrl) && (
          <Input
            maxLength={50}
            placeholder="YouTube Channel Name"
            style={{ marginTop: '1rem' }}
            onChange={text => this.setState({ editedYoutubeName: text })}
            value={editedYoutubeName}
          />
        )}
        <Input
          maxLength={50}
          placeholder="Website URL"
          style={{ marginTop: '1rem', borderColor: websiteError && 'red' }}
          onChange={this.onWebsiteInputChange}
          value={editedWebsite}
        />
        {websiteError && <span style={{ color: 'red' }}>{websiteError}</span>}
        <div
          style={{
            display: 'flex',
            marginTop: '1rem',
            justifyContent: 'center'
          }}
        >
          <Button transparent onClick={onCancel}>
            Cancel
          </Button>
          <Button
            primary
            disabled={
              emailError || websiteError || youtubeError || this.noChange()
            }
            style={{ marginLeft: '0.5rem' }}
            onClick={() =>
              onSubmit({
                email: editedEmail,
                website: editedWebsite,
                youtubeName: editedYoutubeName,
                youtubeUrl: editedYoutubeUrl
              })
            }
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  noChange = () => {
    const {
      editedEmail,
      editedWebsite,
      editedYoutubeName,
      editedYoutubeUrl
    } = this.state;
    const { email, website, youtubeName, youtubeUrl } = this.props;
    return (
      editedEmail === (email || '') &&
      editedWebsite === (website || '') &&
      editedYoutubeName === (youtubeName || '') &&
      editedYoutubeUrl === (youtubeUrl || '')
    );
  };

  onEmailInputChange = text => {
    this.setState({
      editedEmail: text,
      emailError: ''
    });
    this.checkEmail(text);
  };

  checkEmail = text => {
    clearTimeout(this.timer);
    this.timer = setTimeout(
      () =>
        this.setState({
          emailError:
            !stringIsEmpty(text) && !isValidEmail(text)
              ? 'That is not a valid email'
              : ''
        }),
      500
    );
  };

  onWebsiteInputChange = text => {
    this.setState({ editedWebsite: text, websiteError: '' });
    this.checkWebsiteUrl(text);
  };

  checkWebsiteUrl = text => {
    clearTimeout(this.timer);
    this.timer = setTimeout(
      () =>
        this.setState({
          websiteError:
            !stringIsEmpty(text) && !isValidUrl(text)
              ? 'That is not a valid website address'
              : ''
        }),
      500
    );
  };

  onYoutubeInputChange = text => {
    this.setState({
      editedYoutubeUrl: text,
      youtubeError: ''
    });
    this.checkYoutubeUrl(text);
  };

  checkYoutubeUrl = text => {
    clearTimeout(this.timer);
    this.timer = setTimeout(
      () =>
        this.setState({
          youtubeError:
            !stringIsEmpty(text) && !isValidYoutubeChannelUrl(text)
              ? 'That is not a valid YouTube channel address'
              : ''
        }),
      500
    );
  };
}
