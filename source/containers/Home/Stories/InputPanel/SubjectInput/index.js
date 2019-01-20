import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadFeedContent } from 'redux/actions/FeedActions';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Textarea from 'components/Texts/Textarea';
import AttachContentModal from './AttachContentModal';
import Attachment from './Attachment';
import {
  addEmoji,
  exceedsCharLimit,
  stringIsEmpty,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { PanelStyle } from '../Styles';
import { charLimit } from 'constants/defaultValues';
import { uploadContent } from 'helpers/requestHelpers';

class SubjectInput extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    uploadFeedContent: PropTypes.func.isRequired
  };

  state = {
    attachment: undefined,
    attachContentModalShown: false,
    question: '',
    description: '',
    descriptionInputShown: false,
    submitting: false
  };

  render() {
    const {
      attachment,
      attachContentModalShown,
      description,
      descriptionInputShown,
      question,
      submitting
    } = this.state;

    const descriptionExceedsCharLimit = exceedsCharLimit({
      contentType: 'question',
      inputType: 'description',
      text: description
    });
    return (
      <div className={PanelStyle}>
        <p>
          Post a <span style={{ color: Color.green() }}>subject</span> Twinkle
          users can talk about
        </p>
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
              value={question}
              onChange={this.onInputChange}
              style={exceedsCharLimit({
                inputType: 'title',
                contentType: 'question',
                text: question
              })}
            />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            {attachment ? (
              <Attachment
                attachment={attachment}
                onClose={() => this.setState({ attachment: undefined })}
              />
            ) : (
              <Button
                style={{
                  color: Color.green(),
                  fontSize: '1.1rem',
                  lineHeight: '1.5rem',
                  padding: '0.5rem'
                }}
                snow
                onClick={() => this.setState({ attachContentModalShown: true })}
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
                question.length > charLimit.question.title
                  ? 'red'
                  : Color.darkGray()
            }}
          >
            {renderCharLimit({
              inputType: 'title',
              contentType: 'question',
              text: question
            })}
          </span>
        </div>
        {descriptionInputShown && (
          <div style={{ position: 'relative' }}>
            <Textarea
              type="text"
              style={{
                marginTop: '1rem',
                ...(descriptionExceedsCharLimit || null)
              }}
              value={description}
              minRows={4}
              placeholder="Enter Description (Optional, you don't need to write this)"
              onChange={event =>
                this.setState({ description: addEmoji(event.target.value) })
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
            />
            {descriptionExceedsCharLimit && (
              <small style={{ color: 'red' }}>
                {renderCharLimit({
                  contentType: 'question',
                  inputType: 'description',
                  text: description
                })}
              </small>
            )}
            <div className="button-container">
              <Button
                filled
                success
                type="submit"
                style={{ marginTop: '1rem' }}
                disabled={submitting || this.buttonDisabled()}
                onClick={this.onSubmit}
              >
                Post!
              </Button>
            </div>
          </div>
        )}
        {attachContentModalShown && (
          <AttachContentModal
            onHide={() => this.setState({ attachContentModalShown: false })}
            onConfirm={content =>
              this.setState({
                attachment: content,
                attachContentModalShown: false
              })
            }
          />
        )}
      </div>
    );
  }

  buttonDisabled = () => {
    const { question, description } = this.state;
    if (question.length > charLimit.question.title) return true;
    if (description.length > charLimit.question.description) return true;
    return false;
  };

  onInputChange = text => {
    this.setState({
      question: text,
      descriptionInputShown: text.length > 0
    });
  };

  onSubmit = async event => {
    const { dispatch, uploadFeedContent } = this.props;
    const { attachment, question, description } = this.state;
    event.preventDefault();
    if (stringIsEmpty(question) || question.length > charLimit.question.title) {
      return;
    }
    this.setState({ submitting: true });
    try {
      const data = await uploadContent({
        attachment,
        title: question,
        description: finalizeEmoji(description),
        dispatch
      });
      uploadFeedContent(data);
      this.setState({
        attachment: undefined,
        question: '',
        description: '',
        descriptionInputShown: false,
        submitting: false
      });
    } catch (error) {
      this.setState({ submitting: false });
      console.error(error);
    }
  };
}

export default connect(
  null,
  dispatch => ({
    dispatch,
    uploadFeedContent: params => dispatch(uploadFeedContent(params))
  })
)(SubjectInput);
