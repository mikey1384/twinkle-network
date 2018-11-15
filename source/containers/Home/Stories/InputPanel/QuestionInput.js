import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadFeedContent } from 'redux/actions/FeedActions';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Textarea from 'components/Texts/Textarea';
import {
  addEmoji,
  exceedsCharLimit,
  stringIsEmpty,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { PanelStyle } from './Styles';
import { charLimit } from 'constants/defaultValues';
import { uploadContent } from 'helpers/requestHelpers';

class QuestionInput extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    uploadFeedContent: PropTypes.func.isRequired
  };

  state = {
    question: '',
    description: '',
    descriptionInputShown: false,
    submitting: false
  };

  render() {
    const {
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
          Post a <span style={{ color: Color.green() }}>subject</span> users of
          this website could talk about
        </p>
        <Input
          placeholder="Post a subject or ask a question for users of this website"
          value={question}
          onChange={this.onInputChange}
          style={exceedsCharLimit({
            inputType: 'title',
            contentType: 'question',
            text: question
          })}
        />
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
    const { question, description } = this.state;
    event.preventDefault();
    if (stringIsEmpty(question) || question.length > charLimit.question.title) {
      return;
    }
    this.setState({ submitting: true });
    try {
      const data = await uploadContent({
        title: question,
        description: finalizeEmoji(description),
        dispatch
      });
      uploadFeedContent(data);
      this.setState({
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
)(QuestionInput);
