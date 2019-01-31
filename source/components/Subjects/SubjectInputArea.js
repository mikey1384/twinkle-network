import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TitleDescriptionForm from 'components/Forms/TitleDescriptionForm';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { uploadSubject } from 'helpers/requestHelpers';
import { charLimit } from 'constants/defaultValues';
import { connect } from 'react-redux';

class SubjectInputArea extends Component {
  static propTypes = {
    onUploadSubject: PropTypes.func.isRequired,
    contentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    dispatch: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
  };

  state = {
    subjectFormShown: false
  };

  render() {
    const { subjectFormShown } = this.state;
    return (
      <div
        style={{
          background: '#fff',
          fontSize: '1.5rem',
          marginTop: '1rem'
        }}
      >
        <div style={{ padding: '1rem' }}>
          {subjectFormShown ? (
            <TitleDescriptionForm
              autoFocus
              onSubmit={this.onSubmit}
              onClose={() => this.setState({ subjectFormShown: false })}
              rows={4}
              titleMaxChar={charLimit.subject.title}
              descriptionMaxChar={charLimit.subject.description}
              titlePlaceholder="Enter subject topic..."
              descriptionPlaceholder="Enter details... (Optional)"
            />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                logo
                filled
                style={{ fontSize: '2rem' }}
                onClick={() => this.setState({ subjectFormShown: true })}
              >
                <Icon icon="comment-alt" />
                <span style={{ marginLeft: '1rem' }}>
                  Start a New Subject
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  onSubmit = async(title, description) => {
    const { contentId, dispatch, onUploadSubject, type } = this.props;
    const data = await uploadSubject({
      title,
      description,
      dispatch,
      contentId,
      type
    });
    this.setState({ subjectFormShown: false });
    onUploadSubject(data);
  };
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(SubjectInputArea);
