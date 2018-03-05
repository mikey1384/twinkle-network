import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InputForm from 'components/Texts/InputForm'
import TitleDescriptionForm from 'components/Texts/TitleDescriptionForm'
import Button from 'components/Button'
import { connect } from 'react-redux'
import {
  uploadVideoCommentAsync,
  uploadVideoDiscussion,
  loadMoreDiscussions
} from 'redux/actions/VideoActions'
import DiscussionPanel from './DiscussionPanel'
import FilterBar from 'components/FilterBar'
import { Color } from 'constants/css'
import { css } from 'emotion'

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
      <div
        className={css`
          background: #fff;
          margin-top: 1rem;
          padding: 1rem;
          padding-top: 0;
          font-size: 1.5rem;
        `}
      >
        <FilterBar info>
          <nav
            className={discussionTabActive ? 'active' : ''}
            style={{ cursor: 'pointer' }}
            onClick={() => this.setState({ discussionTabActive: true })}
          >
            <a>Discuss</a>
          </nav>
          <nav
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
          </nav>
        </FilterBar>
        <div style={{ marginTop: '2rem' }}>
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
                      logo
                      filled
                      style={{ fontSize: '2rem' }}
                      onClick={() =>
                        this.setState({ discussionFormShown: true })
                      }
                    >
                      <span className="glyphicon glyphicon-comment" /> Start a
                      New Discussion
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
                    <Button
                      transparent
                      onClick={() =>
                        loadMoreDiscussions(
                          videoId,
                          discussions[discussions.length - 1].id
                        )
                      }
                    >
                      Load More
                    </Button>
                  )}
                  {(!discussions || discussions.length === 0) && (
                    <div
                      style={{
                        marginTop: '2rem'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          color: Color.darkGray()
                        }}
                      >
                        Comment on this video
                      </span>
                      <InputForm
                        style={{ marginTop: '1rem' }}
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
  uploadComment: uploadVideoCommentAsync,
  uploadDiscussion: uploadVideoDiscussion,
  loadMoreDiscussions
})(CommentInputArea)
