import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import { checkIfContentExists, uploadContent } from 'helpers/requestHelpers';
import Input from 'components/Texts/Input';
import { scrollElementToCenter } from 'helpers/domHelpers';
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

class ContentInput extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    uploadFeedContent: PropTypes.func.isRequired
  };

  checkContentExistsTimer = null;
  showHelperMessageTimer = null;

  state = {
    alreadyPosted: undefined,
    descriptionFieldShown: false,
    titleFieldShown: false,
    form: {
      url: '',
      isVideo: false,
      title: '',
      description: ''
    },
    urlHelper: '',
    urlError: ''
  };

  render() {
    const {
      alreadyPosted,
      form,
      urlError,
      urlHelper,
      descriptionFieldShown,
      titleFieldShown
    } = this.state;
    return (
      <div className={PanelStyle}>
        <p>Share interesting videos or web links</p>
        {urlError && (
          <Banner love style={{ marginBottom: '1rem' }}>
            {urlError}
          </Banner>
        )}
        <Input
          inputRef={ref => {
            this.UrlField = ref;
          }}
          style={this.errorInUrlField()}
          value={form.url}
          onChange={this.onUrlFieldChange}
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
            this.setState({
              form: {
                ...form,
                isVideo: !form.isVideo
              },
              urlError: null
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
                  onChange={text =>
                    this.setState({ form: { ...form, title: text } })
                  }
                  placeholder="Enter Title Here"
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({
                        form: {
                          ...this.state.form,
                          title: addEmoji(event.target.value)
                        }
                      });
                    }
                  }}
                  style={{
                    marginTop: '0.5rem',
                    ...this.titleExceedsCharLimit()
                  }}
                  type="text"
                />
                {this.titleExceedsCharLimit() && (
                  <small style={{ color: 'red' }}>
                    {this.renderTitleCharLimit()}
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
                    this.setState({
                      form: { ...form, description: event.target.value }
                    })
                  }
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({
                        form: {
                          ...this.state.form,
                          description: addEmoji(event.target.value)
                        }
                      });
                    }
                  }}
                  style={{
                    marginTop: '1rem',
                    ...(this.descriptionExceedsCharLimit() || {})
                  }}
                />
                {this.descriptionExceedsCharLimit() && (
                  <small style={{ color: 'red' }}>
                    {this.renderDescriptionCharLimit()}
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
                success
                style={{ marginTop: '1rem' }}
                disabled={this.buttonDisabled()}
                onClick={this.onSubmit}
              >
                Share!
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  buttonDisabled = () => {
    const {
      form: { url, title }
    } = this.state;
    let result = false;
    if (stringIsEmpty(url) || stringIsEmpty(title)) return true;
    if (this.errorInUrlField()) result = true;
    if (this.titleExceedsCharLimit()) result = true;
    if (this.descriptionExceedsCharLimit()) result = true;
    return result;
  };

  errorInUrlField = () => {
    const {
      form: { isVideo, url },
      urlError
    } = this.state;
    if (urlError) return { borderColor: 'red', color: 'red' };
    return exceedsCharLimit({
      inputType: 'url',
      contentType: isVideo ? 'video' : 'url',
      text: url
    });
  };

  onSubmit = async event => {
    const { form } = this.state;
    const { dispatch, uploadFeedContent } = this.props;
    const { url, isVideo } = form;
    let urlError;
    event.preventDefault();
    if (!isValidUrl(url)) urlError = 'That is not a valid url';
    if (isVideo && !isValidYoutubeUrl(url)) {
      urlError = 'That is not a valid YouTube url';
    }
    if (urlError) {
      this.setState({ urlError });
      this.UrlField.focus();
      return scrollElementToCenter(this.UrlField);
    }
    this.setState({
      alreadyPosted: false,
      titleFieldShown: false,
      descriptionFieldShown: false,
      form: {
        url: '',
        isVideo: false,
        title: '',
        description: ''
      },
      urlHelper: '',
      urlError: ''
    });
    const data = await uploadContent({
      ...form,
      title: finalizeEmoji(form.title),
      description: finalizeEmoji(form.description),
      dispatch
    });
    uploadFeedContent(data);
    document.getElementById('App').scrollTop = 0;
  };

  onUrlFieldChange = url => {
    clearTimeout(this.checkContentExistsTimer);
    clearTimeout(this.showHelperMessageTimer);
    const urlIsValid = isValidUrl(url);
    this.setState(state => ({
      alreadyPosted: false,
      form: {
        ...state.form,
        url,
        isVideo: isValidYoutubeUrl(url)
      },
      titleFieldShown: urlIsValid,
      descriptionFieldShown: urlIsValid,
      urlError: '',
      urlHelper: ''
    }));
    if (urlIsValid) {
      this.checkContentExistsTimer = setTimeout(
        () => this.checkIfContentExists(url),
        300
      );
    }
    this.showHelperMessageTimer = setTimeout(
      () =>
        this.setState(state => ({
          urlHelper:
            urlIsValid || stringIsEmpty(url)
              ? ''
              : `You can think of URL as the "address" of a webpage. For example, this webpage's URL is www.twin-kle.com and www.twinkle.network (yes, you can use either one). YouTube's URL is www.youtube.com, and my favorite YouTube video's URL is https://www.youtube.com/watch?v=rf8FX2sI3gU. You can find a webpage's URL at the top area of your browser. Copy a URL you want to share and paste it to the box above.`,
          titleFieldShown: !stringIsEmpty(url)
        })),
      300
    );
  };

  checkIfContentExists = async url => {
    const isVideo = isValidYoutubeUrl(url);
    const { exists, content } = await checkIfContentExists({
      url,
      type: isVideo ? 'video' : 'url'
    });
    return this.setState({
      alreadyPosted: exists ? content : undefined
    });
  };

  renderDescriptionCharLimit = () => {
    const {
      form: { isVideo, description }
    } = this.state;
    return renderCharLimit({
      inputType: 'description',
      contentType: isVideo ? 'video' : 'url',
      text: description
    });
  };

  renderTitleCharLimit = () => {
    const {
      form: { isVideo, title }
    } = this.state;
    return renderCharLimit({
      inputType: 'title',
      contentType: isVideo ? 'video' : 'url',
      text: title
    });
  };

  descriptionExceedsCharLimit = () => {
    const {
      form: { isVideo, description }
    } = this.state;
    return exceedsCharLimit({
      inputType: 'description',
      contentType: isVideo ? 'video' : 'url',
      text: description
    });
  };

  titleExceedsCharLimit = () => {
    const {
      form: { isVideo, title }
    } = this.state;
    return exceedsCharLimit({
      inputType: 'title',
      contentType: isVideo ? 'video' : 'url',
      text: title
    });
  };
}

export default connect(
  state => ({
    username: state.UserReducer.username
  }),
  dispatch => ({
    dispatch,
    uploadFeedContent: params => dispatch(uploadFeedContent(params))
  })
)(ContentInput);
