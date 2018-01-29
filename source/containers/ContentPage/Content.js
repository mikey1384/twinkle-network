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
        `${URL}/content/${match.url.split('/')[1].slice(0, -1)}?contentId=${contentId}`
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
          onFetchContent: () => console.log('content fetch'),
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
          onShowComments: () => console.log('show comments'),
          onVideoStar: () => console.log('video star')
        }}
        userId={userId}
      />
    )
  }
}

export default connect(state => ({ userId: state.UserReducer.userId }))(Comment)
