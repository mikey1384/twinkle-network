import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import { uploadContent } from 'redux/actions/FeedActions';
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
import Banner from 'components/Banner';
import { PanelStyle } from './Styles';
import { css } from 'emotion';
import { Color } from 'constants/css';
import Checkbox from 'components/Checkbox';

class ContentInput extends Component {
  static propTypes = {
    uploadContent: PropTypes.func.isRequired
  };

  state = {
    descriptionFieldShown: false,
    titleFieldShown: false,
    form: {
      url: '',
      checkedVideo: false,
      title: '',
      description: ''
    },
    urlHelper: '',
    urlError: ''
  };

  render() {
    const {
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
        <Checkbox
          label={'YouTube Video:'}
          onClick={() => {
            this.setState({
              form: {
                ...form,
                checkedVideo: !form.checkedVideo
              },
              urlError: null
            });
          }}
          style={{ marginTop: '1rem' }}
          checked={form.checkedVideo}
        />
        {!stringIsEmpty(urlHelper) && (
          <b
            style={{
              fontSize: '1.7rem',
              marginTop: '1rem',
              display: 'block'
            }}
            className={css`
              > a {
                color: ${Color.oceanBlue()};
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
      form: { checkedVideo, url },
      urlError
    } = this.state;
    if (urlError) return { borderColor: 'red', color: 'red' };
    return exceedsCharLimit({
      inputType: 'url',
      contentType: checkedVideo ? 'video' : 'url',
      text: url
    });
  };

  onSubmit = event => {
    const { uploadContent } = this.props;
    const { form } = this.state;
    const { url, checkedVideo } = form;
    let urlError;
    event.preventDefault();

    if (!isValidUrl(url)) urlError = 'That is not a valid url';
    if (checkedVideo && !isValidYoutubeUrl(url)) {
      urlError = 'That is not a valid YouTube url';
    }

    if (urlError) {
      this.setState({ urlError });
      this.UrlField.focus();
      return scrollElementToCenter(this.UrlField);
    }

    this.setState({
      titleFieldShown: false,
      descriptionFieldShown: false,
      form: {
        url: '',
        checkedVideo: false,
        title: '',
        description: ''
      },
      urlHelper: '',
      urlError: ''
    });
    uploadContent({
      ...form,
      title: finalizeEmoji(form.title),
      description: finalizeEmoji(form.description)
    });
    document.getElementById('App').scrollTop = 0;
  };

  onUrlFieldChange = url => {
    const { form } = this.state;
    if (isValidUrl(url)) {
      this.setState({
        form: {
          ...form,
          url,
          checkedVideo: isValidYoutubeUrl(url) || form.checkedVideo
        },
        urlError: '',
        urlHelper: '',
        descriptionFieldShown: true,
        titleFieldShown: true
      });
    } else {
      this.setState({
        form: {
          ...form,
          url,
          checkedVideo: false
        },
        urlHelper: stringIsEmpty(url)
          ? ''
          : `You can think of URL as the "address" of a webpage. For example, this webpage's URL is www.twin-kle.com and www.twinkle.network (yes, you can use either one). YouTube's URL is www.youtube.com, and my favorite YouTube video's URL is https://www.youtube.com/watch?v=KUWn_TJTrnU. You can find a webpage's URL at the top area of your browser. Copy a URL you want to share and paste it to the box above.`,
        descriptionFieldShown: false,
        titleFieldShown: !stringIsEmpty(url)
      });
    }
  };

  renderDescriptionCharLimit = () => {
    const {
      form: { checkedVideo, description }
    } = this.state;
    return renderCharLimit({
      inputType: 'description',
      contentType: checkedVideo ? 'video' : 'url',
      text: description
    });
  };

  renderTitleCharLimit = () => {
    const {
      form: { checkedVideo, title }
    } = this.state;
    return renderCharLimit({
      inputType: 'title',
      contentType: checkedVideo ? 'video' : 'url',
      text: title
    });
  };

  descriptionExceedsCharLimit = () => {
    const {
      form: { checkedVideo, description }
    } = this.state;
    return exceedsCharLimit({
      inputType: 'description',
      contentType: checkedVideo ? 'video' : 'url',
      text: description
    });
  };

  titleExceedsCharLimit = () => {
    const {
      form: { checkedVideo, title }
    } = this.state;
    return exceedsCharLimit({
      inputType: 'title',
      contentType: checkedVideo ? 'video' : 'url',
      text: title
    });
  };
}

export default connect(
  state => ({
    username: state.UserReducer.username
  }),
  {
    uploadContent
  }
)(ContentInput);
