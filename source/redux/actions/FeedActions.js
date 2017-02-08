import request from 'axios'
import {auth, handleError} from './constants'
import {URL} from 'constants/URL'

const API_URL = `${URL}/feed`

export const clearFeeds = () => ({
  type: 'CLEAR_FEEDS'
})

export const clearCategoriesSearchResults = () => ({
  type: 'CLEAR_CATEGORIES_SEARCH'
})

export const feedVideoCommentDeleteAsync = commentId => dispatch =>
request.delete(`${URL}/video/comments?commentId=${commentId}`, auth())
.then(
  response => dispatch({
    type: 'FEED_VIDEO_COMMENT_DELETE',
    commentId
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const feedVideoCommentEditAsync = (params, cb) => dispatch =>
request.post(`${URL}/video/comments/edit`, params, auth())
.then(
  response => {
    const {success} = response.data
    if (!success) return
    dispatch({
      type: 'FEED_VIDEO_COMMENT_EDIT',
      data: params
    })
    cb()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const feedVideoCommentLike = data => ({
  type: 'FEED_VIDEO_COMMENT_LIKE',
  data
})

export const feedVideoCommentLikeAsync = commentId => dispatch =>
request.post(`${URL}/video/comments/like`, {commentId}, auth())
.then(
  response => {
    const {data} = response
    if (data.likes) {
      dispatch(feedVideoCommentLike({contentId: commentId, likes: data.likes}))
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const fetchCategories = data => ({
  type: 'FETCH_CATEGORIES',
  data
})

export const fetchCategoriesAsync = (searchText) => dispatch => {
  request.get(`${API_URL}/category?searchText=${searchText}`).then(
    response => dispatch(fetchCategories(response.data))
  )
}

export const fetchFeed = feed => dispatch => {
  let query = []
  for (let key in feed) {
    query.push(`${key}=${feed[key]}&`)
  }
  query = query.join('').slice(0, -1)
  request.get(`
    ${API_URL}/feed?${query}
  `).then(
    response => dispatch({
      type: 'FETCH_FEED',
      data: {
        ...response.data,
        childComments: [],
        commentsShown: false,
        commentsLoadMoreButton: false,
        isReply: false
      }
    })
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const fetchFeedsAsync = (filter = 'all') => dispatch => {
  request.get(`${API_URL}?filter=${filter}`).then(
    response => dispatch({
      type: 'FETCH_FEEDS',
      data: response.data,
      filter
    })
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const fetchMoreFeedsAsync = (lastFeedId, filter = 'all', callback) => dispatch => {
  request.get(`${API_URL}?lastFeedId=${lastFeedId}&filter=${filter}&limit=6`).then(
    response => {
      dispatch({
        type: 'FETCH_MORE_FEEDS',
        data: response.data,
        filter
      })
      if (callback) callback()
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const likeVideo = data => ({
  type: 'FEED_VIDEO_LIKE',
  data
})

export const likeVideoAsync = contentId => dispatch =>
request.post(`${URL}/video/like`, {videoId: contentId}, auth())
.then(
  response => {
    const {data} = response
    if (data.likes) {
      dispatch(likeVideo({contentId, likes: data.likes}))
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const likeVideoComment = data => ({
  type: 'FEED_VIDEO_COMMENT_LIKE',
  data
})

export const likeVideoCommentAsync = contentId => dispatch =>
request.post(`${URL}/video/comments/like`, {commentId: contentId}, auth())
.then(
  response => {
    const {data} = response
    if (data.likes) {
      dispatch(likeVideoComment({contentId, likes: data.likes}))
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const likeTargetVideoComment = data => ({
  type: 'FEED_TARGET_VIDEO_COMMENT_LIKE',
  data
})

export const likeTargetVideoCommentAsync = contentId => dispatch =>
request.post(`${URL}/video/comments/like`, {commentId: contentId}, auth())
.then(
  response => {
    const {data} = response
    if (data.likes) {
      dispatch(likeTargetVideoComment({contentId, likes: data.likes}))
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadMoreFeedCommentsAsync = (lastCommentId, type, contentId, isReply) => dispatch =>
request.get(
  `${API_URL}/comments?type=${type}&contentId=${contentId}&lastCommentId=${lastCommentId}&isReply=${isReply}`
).then(
  response => dispatch({
    type: 'LOAD_MORE_FEED_COMMENTS',
    data: {type, contentId, childComments: response.data}
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadMoreFeedReplies = (lastReplyId, commentId, parent) => dispatch =>
request.get(`${URL}/video/replies?lastReplyId=${lastReplyId}&commentId=${commentId}`)
.then(
  response => dispatch({
    type: 'FETCH_MORE_FEED_REPLIES',
    data: response.data,
    commentId,
    contentType: parent.type
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const showFeedCommentsAsync = (type, contentId, commentLength, isReply) => dispatch =>
request.get(
  `${API_URL}/comments?type=${type}&contentId=${contentId}&commentLength=${commentLength}&isReply=${isReply}`
)
.then(
  response => dispatch({
    type: 'SHOW_FEED_COMMENTS',
    data: {type, contentId, childComments: response.data}
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadContent = data => ({
  type: 'UPLOAD_CONTENT',
  data
})

export const uploadContentAsync = form => dispatch =>
request.post(`${API_URL}/content`, form, auth())
.then(
  response => {
    const {data} = response
    dispatch(uploadContent(data))
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadFeedVideoComment = data => ({
  type: 'UPLOAD_FEED_VIDEO_COMMENT',
  data
})

export const uploadFeedVideoReply = data => ({
  type: 'UPLOAD_FEED_VIDEO_REPLY',
  data
})

export const uploadFeedVideoCommentAsync = (comment, parent) => dispatch => {
  const parentType = parent.type
  let commentType
  let params
  switch (parentType) {
    case 'comment':
      params = {
        reply: comment,
        videoId: parent.parentContentId,
        commentId: parent.commentId || parent.id,
        replyId: parent.commentId ? parent.id : null
      }
      commentType = 'replies'
      break
    case 'video':
      params = {comment, videoId: parent.id}
      commentType = 'comments'
      break
    case 'discussion':
      params = {comment, videoId: parent.parentContentId, discussionId: parent.id}
      commentType = 'debates/comments'
      break
    default: return console.error('Invalid content type')
  }

  request.post(`${URL}/video/${commentType}`, params, auth())
  .then(
    response => {
      const {data} = response
      const action = (parentType === 'comment') ?
      uploadFeedVideoReply({
        type: parent.type,
        contentId: parent.id,
        reply: {...data.result, replies: []}
      }) :
      uploadFeedVideoComment({
        ...data,
        type: parent.type,
        contentId: parent.id
      })
      dispatch(action)
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const uploadFeedVideoReplyAsync = ({replyContent, comment, parent, replyOfReply, originType}) =>
dispatch => {
  const params = {reply: replyContent, videoId: parent.parentContentId, commentId: comment.commentId || comment.id, replyId: comment.commentId ? comment.id : null}
  request.post(`${URL}/video/replies`, params, auth())
  .then(
    response => {
      const {data} = response
      const action = uploadFeedVideoReply({
        type: parent.type,
        contentId: parent.type === 'comment' ? comment.id : parent.id,
        reply: {
          ...data.result,
          replyOfReply,
          originType,
          replies: []
        },
        commentId: comment.id
      })
      dispatch(action)
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const uploadTargetContentComment = (params, panelId) =>
dispatch => request.post(`${API_URL}/targetContentComment`, params, auth())
.then(
  response => dispatch({
    type: 'UPLOAD_TC_COMMENT',
    data: response.data,
    panelId
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)
