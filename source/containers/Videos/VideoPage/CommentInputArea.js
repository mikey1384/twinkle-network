import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InputForm from 'components/Texts/InputForm'
import TitleDescriptionForm from 'components/Texts/TitleDescriptionForm'
import Button from 'components/Button'
import { connect } from 'react-redux'
import {
  uploadVideoComment,
  uploadVideoDiscussion
} from 'redux/actions/VideoActions'
import FilterBar from 'components/FilterBar'
import { charLimit } from 'constants/defaultValues'
import { css } from 'emotion'

class CommentInputArea extends Component {
  static propTypes = {
    discussionTabActive: PropTypes.bool.isRequired,
    onDiscussionTabClick: PropTypes.func.isRequired,
    uploadComment: PropTypes.func.isRequired,
    uploadDiscussion: PropTypes.func.isRequired,
    videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired
  }

  state = {
    discussionFormShown: false
  }

  render() {
    const {
      videoId,
      uploadComment,
      uploadDiscussion,
      discussionTabActive,
      onDiscussionTabClick
    } = this.props
    const { discussionFormShown } = this.state
    return (
      <div
        className={css`
          background: #fff;
          margin-top: 1rem;
          padding: 1rem 1rem ${discussionTabActive ? '2rem' : '1rem'} 1rem;
          padding-top: 0;
          ${!discussionTabActive
            ? 'margin-bottom: -1rem;'
            : ''} font-size: 1.5rem;
        `}
      >
        <FilterBar info>
          <nav
            className={discussionTabActive ? 'active' : ''}
            style={{ cursor: 'pointer' }}
            onClick={() => onDiscussionTabClick(true)}
          >
            Discuss
          </nav>
          <nav
            className={!discussionTabActive ? 'active' : ''}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              onDiscussionTabClick(false)
              this.setState({
                discussionFormShown: false
              })
            }}
          >
            Comment on this video
          </nav>
        </FilterBar>
        <div style={{ marginTop: '2rem' }}>
          {discussionTabActive && (
            <div style={{ padding: '0 1rem' }}>
              {discussionFormShown ? (
                <TitleDescriptionForm
                  autoFocus
                  onSubmit={(title, description) =>
                    uploadDiscussion(title, description, videoId)
                  }
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
                    <span className="glyphicon glyphicon-comment" /> Start a New
                    Discussion
                  </Button>
                </div>
              )}
            </div>
          )}
          {!discussionTabActive && (
            <InputForm
              autoFocus
              onSubmit={text => uploadComment(text, videoId)}
              rows={4}
              placeholder="Write your comment here..."
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect(null, {
  uploadComment: uploadVideoComment,
  uploadDiscussion: uploadVideoDiscussion
})(CommentInputArea)
