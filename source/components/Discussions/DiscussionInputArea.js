import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TitleDescriptionForm from 'components/Forms/TitleDescriptionForm';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { uploadDiscussion } from 'helpers/requestHelpers';
import { charLimit } from 'constants/defaultValues';
import { connect } from 'react-redux';

class DiscussionInputArea extends Component {
  static propTypes = {
    onUploadDiscussion: PropTypes.func.isRequired,
    contentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    dispatch: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
  };

  state = {
    discussionFormShown: false
  };

  render() {
    const { discussionFormShown } = this.state;
    return (
      <div
        style={{
          background: '#fff',
          fontSize: '1.5rem',
          marginTop: '1rem'
        }}
      >
        <div style={{ padding: '1rem' }}>
          {discussionFormShown ? (
            <TitleDescriptionForm
              autoFocus
              onSubmit={this.onSubmit}
              onClose={() => this.setState({ discussionFormShown: false })}
              rows={4}
              titleMaxChar={charLimit.discussion.title}
              descriptionMaxChar={charLimit.discussion.description}
              titlePlaceholder="Enter discussion topic..."
              descriptionPlaceholder="Enter details... (Optional)"
            />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                logo
                filled
                style={{ fontSize: '2rem' }}
                onClick={() => this.setState({ discussionFormShown: true })}
              >
                <Icon icon="comment-alt" />
                <span style={{ marginLeft: '1rem' }}>
                  Start a New Discussion
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  onSubmit = async(title, description) => {
    const { contentId, dispatch, onUploadDiscussion, type } = this.props;
    const data = await uploadDiscussion({
      title,
      description,
      dispatch,
      contentId,
      type
    });
    this.setState({ discussionFormShown: false });
    onUploadDiscussion(data);
  };
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(DiscussionInputArea);
