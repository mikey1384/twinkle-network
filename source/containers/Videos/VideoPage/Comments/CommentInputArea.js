import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InputArea from 'components/Texts/InputArea'
import TitleDescriptionForm from 'components/Texts/TitleDescriptionForm'
import Button from 'components/Button'
import { connect } from 'react-redux'
import {
  uploadVideoCommentAsync,
  uploadVideoDiscussion,
  loadMoreDiscussions
} from 'redux/actions/VideoActions'
import DiscussionPanel from './DiscussionPanel'

class CommentInputArea extends Component {
  static propTypes = {
    discussions: PropTypes.array,
    loadMoreDiscussions: PropTypes.func.isRequired,
    loadMoreDiscussionsButton: PropTypes.bool,
    uploadComment: PropTypes.func.isRequired,
    uploadDiscussion: PropTypes.func.isRequired,
    videoId: PropTypes.number.isRequired
  }

  constructor() {
    super()
    this.state = {
      discussionTabActive: true,
      discussionFormShown: false
    }
  }
  render() {
    const {
      videoId,
      uploadComment,
      uploadDiscussion,
      loadMoreDiscussionsButton,
      discussions,
      loadMoreDiscussions
    } = this.props
    const { discussionTabActive, discussionFormShown } = this.state
    return (
      <div className="page-header" style={{ marginTop: '2rem' }}>
        <div>
          <ul
            className="nav nav-tabs"
            style={{ fontSize: '1.3em', fontWeight: 'bold' }}
          >
            <li
              className={discussionTabActive ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({ discussionTabActive: true })}
            >
              <a>Discuss</a>
            </li>
            <li
              className={!discussionTabActive ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                this.setState({
                  discussionTabActive: false,
                  discussionFormShown: false
                })
              }
            >
              <a>Comment on this video</a>
            </li>
          </ul>
        </div>
        <div style={{ marginTop: '1.5em' }}>
          {discussionTabActive && (
            <div style={{ padding: '0 1rem' }}>
              <div>
                <div>
                  {discussionFormShown ? (
                    <TitleDescriptionForm
                      autoFocus
                      onSubmit={(title, description) =>
                        uploadDiscussion(title, description, videoId)
                      }
                      rows={4}
                      titlePlaceholder="Enter discussion topic..."
                      descriptionPlaceholder="Enter details... (Optional)"
                    />
                  ) : (
                    <Button
                      className="btn btn-primary"
                      onClick={() =>
                        this.setState({ discussionFormShown: true })
                      }
                    >
                      Start a New Discussion
                    </Button>
                  )}
                </div>
                <div>
                  {!!discussions &&
                    discussions.length > 0 && (
                      <h3 style={{ marginTop: '1.5rem' }}>
                        Active Discussions
                      </h3>
                    )}
                  {!!discussions &&
                    discussions.map(discussion => (
                      <DiscussionPanel
                        key={discussion.id}
                        videoId={videoId}
                        {...discussion}
                      />
                    ))}
                  {loadMoreDiscussionsButton && (
                    <div
                      className="text-center"
                      style={{ paddingTop: '0.5em' }}
                    >
                      <Button
                        className="btn btn-success"
                        onClick={() =>
                          loadMoreDiscussions(
                            videoId,
                            discussions[discussions.length - 1].id
                          )
                        }
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                  {(!discussions || discussions.length === 0) && (
                    <div>
                      <h3 style={{ marginTop: '1.5rem' }}>
                        Comment on this video
                      </h3>
                      <InputArea
                        onSubmit={text => uploadComment(text, videoId)}
                        rows={4}
                        placeholder="Write your comment here..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {!discussionTabActive && (
            <div className="container-fluid">
              <InputArea
                autoFocus
                onSubmit={text => uploadComment(text, videoId)}
                rows={4}
                placeholder="Write your comment here..."
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default connect(null, {
  uploadComment: uploadVideoCommentAsync,
  uploadDiscussion: uploadVideoDiscussion,
  loadMoreDiscussions
})(CommentInputArea)
