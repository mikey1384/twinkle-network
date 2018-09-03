import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadContent } from 'redux/actions/FeedActions';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Textarea from 'components/Texts/Textarea';
import {
  addEmoji,
  exceedsCharLimit,
  stringIsEmpty,
  finalizeEmoji,
  renderCharLimit,
  turnStringIntoQuestion
} from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { PanelStyle } from './Styles';
import { charLimit } from 'constants/defaultValues';

class QuestionInput extends Component {
  static propTypes = {
    uploadContent: PropTypes.func.isRequired
  };

  state = {
    question: '',
    description: '',
    descriptionInputShown: false
  };

  render() {
    const { description, descriptionInputShown, question } = this.state;
    const descriptionExceedsCharLimit = exceedsCharLimit({
      contentType: 'question',
      inputType: 'description',
      text: description
    });
    return (
      <div className={PanelStyle}>
        <p>
          Ask <span style={{ color: Color.green() }}>questions</span> to friends
          and teachers in Twinkle
        </p>
        <Input
          placeholder="Ask a question (and feel free to answer your own questions)"
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
          <div
            css={`
              position: relative;
            `}
          >
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
                disabled={this.buttonDisabled()}
                onClick={this.onSubmit}
              >
                Ask!
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
    const { uploadContent } = this.props;
    const { question, description } = this.state;
    event.preventDefault();
    if (stringIsEmpty(question) || question.length > charLimit.question.title) {
      return;
    }
    await uploadContent({
      title: turnStringIntoQuestion(question),
      description: finalizeEmoji(description)
    });
    this.setState({
      question: '',
      description: '',
      descriptionInputShown: false
    });
  };
}

export default connect(
  null,
  { uploadContent }
)(QuestionInput);
