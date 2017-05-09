import request from 'axios'
import {auth, handleError} from './constants'
import {URL} from 'constants/URL'

const API_URL = `${URL}/feed`

export const clearFeeds = () => dispatch => {
  dispatch({
    type: 'CLEAR_FEEDS'
  })
  return Promise.resolve()
}

export const clearCategoriesSearchResults = () => ({
  type: 'CLEAR_CATEGORIES_SEARCH'
})

export const commentFeedLike = commentId => dispatch =>
request.post(`${API_URL}/comments/like`, {commentId}, auth())
.then(
  response => {
    const {data} = response
    if (data.likes) {
      dispatch({
        type: 'COMMENT_FEED_LIKE',
        data: {contentId: commentId, likes: data.likes}
      })
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const connectHomeComponent = () => ({
  type: 'CONNECT_HOME_COMPONENT'
})

export const disconnectHomeComponent = () => ({
  type: 'DISCONNECT_HOME_COMPONENT'
})

export const contentFeedLike = (contentId, rootType) => dispatch =>
request.post(`${URL}/${rootType}/like`, {contentId}, auth())
.then(
  response => {
    const {data} = response
    if (data.likes) {
      dispatch({
        type: 'CONTENT_FEED_LIKE',
        data: {contentId, likes: data.likes}
      })
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const feedCommentDelete = commentId => dispatch =>
request.delete(`${API_URL}/comments?commentId=${commentId}`, auth())
.then(
  response => dispatch({
    type: 'FEED_COMMENT_DELETE',
    commentId
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const feedCommentEdit = (params, cb) => dispatch =>
request.put(`${API_URL}/comments`, params, auth())
.then(
  response => {
    const {success} = response.data
    if (!success) return
    dispatch({
      type: 'FEED_COMMENT_EDIT',
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

export const fetchFeedsAsync = (filter = 'all') => dispatch =>
request.get(`${API_URL}?filter=${filter}`).then(
  response => {
    dispatch({
      type: 'FETCH_FEEDS',
      data: response.data,
      filter
    })
    return Promise.resolve()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const fetchMoreFeedsAsync = (lastFeedId, filter = 'all') => dispatch =>
request.get(`${API_URL}?lastFeedId=${lastFeedId}&filter=${filter}&limit=6`).then(
  response => {
    dispatch({
      type: 'FETCH_MORE_FEEDS',
      data: response.data,
      filter
    })
    return Promise.resolve()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const fetchUserFeeds = (username, type) => dispatch =>
request.get(`${API_URL}/user/?username=${username}&type=${type}`).then(
  response => {
    dispatch({
      type: 'FETCH_FEEDS',
      data: response.data
    })
    return Promise.resolve()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const fetchMoreUserFeeds = (username, type, lastId) => dispatch =>
request.get(`${API_URL}/user/?username=${username}&type=${type}&lastId=${lastId}`).then(
  response => {
    dispatch({
      type: 'FETCH_MORE_FEEDS',
      data: response.data
    })
    return Promise.resolve()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const likeTargetComment = contentId => dispatch =>
request.post(`${API_URL}/comments/like`, {commentId: contentId}, auth())
.then(
  response => {
    const {data} = response
    if (data.likes) {
      dispatch({
        type: 'FEED_TARGET_COMMENT_LIKE',
        data: {contentId, likes: data.likes}
      })
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
request.get(`${API_URL}/replies?lastReplyId=${lastReplyId}&commentId=${commentId}&rootType=${parent.rootType}`)
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

export const lockScroll = () => ({
  type: 'LOCK_SCROLL'
})

export const unlockScroll = () => ({
  type: 'UNLOCK_SCROLL'
})

export const showFeedCommentsAsync = ({rootType, type, contentId, commentLength, isReply}) => dispatch =>
request.get(
  `${API_URL}/comments?rootType=${rootType}&type=${type}&contentId=${contentId}&commentLength=${commentLength}&isReply=${isReply}`
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

export const uploadFeedComment = (comment, parent) => dispatch => {
  const contentType = parent.type
  let commentType
  let params
  switch (contentType) {
    case 'comment':
      params = {
        content: comment,
        rootId: parent.rootId,
        rootType: parent.rootType,
        discussionId: parent.discussionId,
        commentId: parent.commentId || parent.id,
        replyId: parent.commentId ? parent.id : null
      }
      commentType = 'replies'
      break
    case 'url':
      params = {content: comment, rootId: parent.id, rootType: 'url'}
      commentType = 'comments'
      break
    case 'video':
      params = {content: comment, rootId: parent.id, rootType: 'video'}
      commentType = 'comments'
      break
    case 'discussion':
      params = {content: comment, rootId: parent.rootId, rootType: parent.rootType, discussionId: parent.id}
      commentType = 'comments'
      break
    default: return console.error('Invalid content type')
  }

  return request.post(`${API_URL}/${commentType}`, params, auth())
  .then(
    response => {
      const {data} = response
      const action = (contentType === 'comment') ?
      {
        type: 'UPLOAD_FEED_REPLY',
        data: {
          reply: {...data.result, replies: []},
          type: parent.type,
          contentId: parent.id
        }
      } :
      {
        type: 'UPLOAD_FEED_COMMENT',
        data: {
          ...data,
          type: parent.type,
          contentId: parent.id
        }
      }
      dispatch(action)
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const uploadFeedReply = ({replyContent, comment, parent, replyOfReply, originType}) =>
dispatch => {
  const params = {
    content: replyContent,
    rootId: parent.rootId,
    rootType: parent.rootType,
    discussionId: parent.discussionId,
    commentId: comment.commentId || comment.id,
    replyId: comment.commentId ? comment.id : null
  }
  request.post(`${API_URL}/replies`, params, auth())
  .then(
    response => {
      const {data} = response
      dispatch({
        type: 'UPLOAD_FEED_REPLY',
        data: {
          type: parent.type,
          contentId: parent.type === 'comment' ? comment.id : parent.id,
          reply: {
            ...data.result,
            replyOfReply,
            originType,
            replies: []
          },
          commentId: comment.id
        }
      })
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
