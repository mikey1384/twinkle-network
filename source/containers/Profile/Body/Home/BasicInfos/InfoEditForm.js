import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import { isValidEmail, stringIsEmpty } from 'helpers/stringHelpers';

export default class InfoEditForm extends Component {
  static propTypes = {
    email: PropTypes.string,
    youtubeUrl: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor({ email, youtubeUrl }) {
    super();
    this.state = {
      editedEmail: email || '',
      emailError: '',
      editedYoutubeUrl: youtubeUrl || ''
    };
  }

  render() {
    const { onCancel, onSubmit } = this.props;
    const { editedEmail, emailError, editedYoutubeUrl } = this.state;
    return (
      <div>
        <Input
          placeholder="Email Address"
          onChange={this.onEmailInputChange}
          value={editedEmail}
          style={{ borderColor: emailError && 'red' }}
        />
        {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
        <Input
          placeholder="YouTube Address"
          style={{ marginTop: '1rem' }}
          onChange={text => this.setState({ editedYoutubeUrl: text })}
          value={editedYoutubeUrl}
        />
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
            disabled={true}
            style={{ marginLeft: '0.5rem' }}
            onClick={onSubmit}
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  onEmailInputChange = text => {
    this.setState({
      editedEmail: text,
      emailError:
        !stringIsEmpty(text) && !isValidEmail(text)
          ? 'That is not a valid email'
          : ''
    });
  };
}
