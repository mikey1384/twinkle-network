import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentPanel from 'components/ContentPanel'
import { connect } from 'react-redux'
import request from 'axios'
import { URL } from 'constants/URL'

class Comment extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    userId: PropTypes.number
  }

  state = {
    contentObj: {}
  }

  async componentDidMount() {
    const { match, match: { params: { contentId } } } = this.props
    try {
      const { data } = await request.get(
        `${URL}/content/${match.url
          .split('/')[1]
          .slice(0, -1)}?contentId=${contentId}`
      )
      this.setState({ contentObj: data })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { userId } = this.props
    const { contentObj } = this.state
    return (
      <ContentPanel
        selfLoadingDisabled
        contentObj={contentObj}
        methodObj={{
          onCommentSubmit: () => console.log('comment submit'),
          onReplySubmit: () => console.log('reply submit'),
          onTargetCommentSubmit: () => console.log('target comment submit'),
          onLikeContent: () => console.log('like content'),
          onLikeComment: () => console.log('like comment'),
          onLikeTargetComment: () => console.log('like target comment'),
          onLikeQuestion: () => console.log('like question'),
          onDeleteContent: () => console.log('delete content'),
          onDeleteComment: () => console.log('delete comment'),
          onEditComment: () => console.log('edit comment'),
          onLoadMoreComments: () => console.log('load more comments'),
          onLoadMoreReplies: () => console.log('load more replies'),
          onShowComments: this.onShowComments,
          onVideoStar: () => console.log('video star')
        }}
        userId={userId}
      />
    )
  }

  onShowComments = async() => {
    const { match, match: { params: { contentId } } } = this.props
    const { contentObj } = this.state
    const type = match.url.split('/')[1].slice(0, -1)
    const params =
      type === 'comment'
        ? {
            commentType: 'replies',
            contentIdLabel: 'commentId',
            loadMoreButtonLabel: 'loadMoreReplies'
          }
        : {
            commentType: 'comments',
            contentIdLabel: 'rootId',
            loadMoreButtonLabel: 'loadMoreComments'
          }
    const { commentType, contentIdLabel, loadMoreButtonLabel } = params
    try {
      const {
        data: { [commentType]: comments, [loadMoreButtonLabel]: loadMoreButton }
      } = await request.get(
        `${URL}/content/${commentType}?rootType=${
          contentObj.rootType || contentObj.type
        }&${contentIdLabel}=${contentId}`
      )
      this.setState(state => ({
        contentObj: {
          ...contentObj,
          childComments: comments,
          commentsLoadMoreButton: loadMoreButton
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }
}

export default connect(state => ({ userId: state.UserReducer.userId }))(Comment)
