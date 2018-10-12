import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import {
  exceedsCharLimit,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';
import { css } from 'emotion';

export default class InputForm extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    formGroupStyle: PropTypes.object,
    innerRef: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string
  };

  state = {
    submitting: false,
    text: ''
  };

  render() {
    const { submitting, text } = this.state;
    const {
      innerRef,
      placeholder,
      rows,
      autoFocus,
      formGroupStyle = {},
      style = {},
      className = ''
    } = this.props;
    const commentExceedsCharLimit = exceedsCharLimit({
      contentType: 'comment',
      text
    });
    return (
      <div style={style} className={className}>
        <div
          style={{
            position: 'relative',
            ...formGroupStyle
          }}
        >
          <Textarea
            autoFocus={autoFocus}
            innerRef={innerRef}
            style={{
              fontSize: '1.7rem',
              ...(commentExceedsCharLimit || {})
            }}
            minRows={rows}
            value={text}
            placeholder={placeholder}
            onChange={event => this.setState({ text: event.target.value })}
            onKeyUp={this.handleKeyUp}
          />
          {commentExceedsCharLimit && (
            <small style={{ color: 'red', fontSize: '1.3rem' }}>
              {renderCharLimit({
                contentType: 'comment',
                text
              })}
            </small>
          )}
        </div>
        {!stringIsEmpty(text) && (
          <div
            className={css`
              display: flex;
              flex-direction: row-reverse;
            `}
          >
            <Button
              style={{ marginTop: '1rem', marginBottom: '0.5rem' }}
              filled
              success
              disabled={
                submitting || stringIsEmpty(text) || commentExceedsCharLimit
              }
              onClick={this.onSubmit}
            >
              Click This Button to Submit!
            </Button>
          </div>
        )}
      </div>
    );
  }

  handleKeyUp = event => {
    if (event.key === ' ') {
      this.setState({ text: addEmoji(event.target.value) });
    }
  };

  onSubmit = async() => {
    this.setState({ submitting: true });
    try {
      await this.props.onSubmit(finalizeEmoji(this.state.text));
      this.setState({ text: '', submitting: false });
    } catch (error) {
      this.setState({ submitting: false });
      console.error(error);
    }
  };
}
