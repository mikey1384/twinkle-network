import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers';
import Input from './Input';

export default class TitleDescriptionForm extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    descriptionMaxChar: PropTypes.number,
    descriptionPlaceholder: PropTypes.string,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    rows: PropTypes.number,
    titleMaxChar: PropTypes.number,
    titlePlaceholder: PropTypes.string
  };

  state = {
    title: '',
    description: ''
  };

  render() {
    const {
      autoFocus,
      onClose,
      rows,
      titlePlaceholder,
      titleMaxChar = 300,
      descriptionMaxChar = 5000,
      descriptionPlaceholder
    } = this.props;
    const { title, description } = this.state;
    return (
      <div>
        <Input
          autoFocus={autoFocus}
          placeholder={titlePlaceholder}
          type="text"
          value={title}
          style={{
            borderColor: title.length > titleMaxChar && 'red',
            color: title.length > titleMaxChar && 'red'
          }}
          onChange={text => this.setState({ title: text })}
          onKeyUp={event =>
            this.setState({ title: addEmoji(event.target.value) })
          }
        />
        {title.length > titleMaxChar && (
          <small style={{ color: 'red', fontSize: '1.6rem' }}>
            {`Exceeded title's`} character limit of {titleMaxChar} characters.
            You can write more in the description field below.
          </small>
        )}
        <div style={{ position: 'relative' }}>
          <Textarea
            style={{
              marginTop: '1rem',
              color: description.length > descriptionMaxChar && 'red',
              borderColor: description.length > descriptionMaxChar && 'red'
            }}
            minRows={rows}
            placeholder={descriptionPlaceholder}
            value={description}
            onChange={event =>
              this.setState({ description: event.target.value })
            }
          />
        </div>
        {description.length > descriptionMaxChar && (
          <small style={{ color: 'red', fontSize: '1.3rem' }}>
            {descriptionMaxChar} character limit exceeded
          </small>
        )}
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            transparent
            style={{ fontSize: '1.7rem', marginRight: '1rem' }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            primary
            style={{ fontSize: '1.7rem' }}
            onClick={this.onSubmit}
            disabled={
              !title ||
              stringIsEmpty(title) ||
              title.length > titleMaxChar ||
              description.length > descriptionMaxChar
            }
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }

  onSubmit = event => {
    const { onSubmit } = this.props;
    const { title, description } = this.state;
    event.preventDefault();
    onSubmit(finalizeEmoji(title), finalizeEmoji(description));
    this.setState({
      title: '',
      description: ''
    });
  };
}
