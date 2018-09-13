import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TitleDescriptionForm from 'components/Texts/TitleDescriptionForm';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { connect } from 'react-redux';
import { uploadVideoDiscussion } from 'redux/actions/VideoActions';
import { charLimit } from 'constants/defaultValues';

class DiscussionInputArea extends Component {
  static propTypes = {
    uploadDiscussion: PropTypes.func.isRequired,
    videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired
  };

  state = {
    discussionFormShown: false
  };

  render() {
    const { videoId, uploadDiscussion } = this.props;
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
              onSubmit={(title, description) => {
                uploadDiscussion(title, description, videoId);
                this.setState({ discussionFormShown: false });
              }}
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
}

export default connect(
  null,
  {
    uploadDiscussion: uploadVideoDiscussion
  }
)(DiscussionInputArea);
