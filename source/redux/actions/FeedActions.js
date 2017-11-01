import request from 'axios'
import {auth, handleError} from './constants'
import {URL} from 'constants/URL'
import {processedQueryString} from 'helpers/stringHelpers'

const API_URL = `${URL}/feed`

export const clearFeeds = () => dispatch => {
  dispatch({
    type: 'CLEAR_FEEDS'
  })
  return Promise.resolve()
}

export const commentFeedLike = commentId => dispatch =>
request.post(`${API_URL}/comments/like`, {commentId}, auth()).then(
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

export const contentFeedLike = (contentId, rootType) => dispatch =>
request.post(`${URL}/${rootType}/like`, {contentId}, auth()).then(
  response => {
    const {data} = response
    if (data.likes) {
      dispatch({
        type: 'CONTENT_FEED_LIKE',
        data: {contentId, rootType, likes: data.likes}
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

export const questionFeedLike = contentId => async(dispatch) => {
  try {
    const {data: {likes}} = await request.post(`${URL}/content/question/like`, {contentId}, auth())
    dispatch({
      type: 'QUESTION_FEED_LIKE',
      data: {contentId, likes}
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const feedCommentDelete = commentId => dispatch =>
  request.delete(`${API_URL}/comments?commentId=${commentId}`, auth()).then(
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

export const feedContentDelete = ({type, contentId}) => dispatch =>
  request.delete(`${URL}/content?contentId=${contentId}&type=${type}`, auth()).then(
    () => {
      if (type === 'comment') {
        return dispatch({
          type: 'FEED_COMMENT_DELETE',
          commentId: contentId
        })
      } else {
        return dispatch({
          type: 'FEED_CONTENT_DELETE',
          contentType: type,
          contentId
        })
      }
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const feedCommentEdit = (params) => dispatch =>
  request.put(`${API_URL}/comments`, params, auth()).then(
    ({data}) => {
      dispatch({
        type: 'FEED_COMMENT_EDIT',
        ...data
      })
      return Promise.resolve()
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const feedContentEdit = (params) => dispatch =>
  request.put(`${URL}/content`, params, auth()).then(
    ({data}) => {
      if (params.type === 'comment') {
        dispatch({
          type: 'FEED_COMMENT_EDIT',
          commentId: params.contentId,
          editedComment: data.content
        })
      } else if (params.type === 'discussion') {
        dispatch({
          type: 'FEED_DISCUSSION_EDIT',
          contentId: params.contentId,
          editedTitle: data.title,
          editedDescription: data.description
        })
      } else if (params.type === 'question') {
        dispatch({
          type: 'FEED_QUESTION_EDIT',
          contentId: params.contentId,
          editedContent: data.content
        })
      } else {
        dispatch({
          type: 'FEED_CONTENT_EDIT',
          contentType: params.type,
          contentId: params.contentId,
          editedTitle: data.title,
          editedDescription: data.description,
          editedUrl: data.content
        })
      }
      return Promise.resolve()
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const fetchFeed = feed => dispatch => {
  let query = []
  for (let key in feed) {
    query.push(`${key}=${feed[key]}&`)
  }
  query = query.join('').slice(0, -1)
  request.get(`
    ${API_URL}/feed?${processedQueryString(query)}
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
request.get(
  `${API_URL}/replies?lastReplyId=${lastReplyId}&commentId=${commentId}&rootType=${parent.rootType}`
).then(
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

export const showFeedCommentsAsync = ({rootType, type, contentId, commentLength, isReply}) => dispatch =>
request.get(
  `${API_URL}/comments?rootType=${rootType}&type=${type}&contentId=${contentId}&commentLength=${commentLength}&isReply=${isReply}`
).then(
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

export const uploadContentAsync = form => dispatch =>
request.post(`${API_URL}/content`, form, auth()).then(
  response => {
    const {data} = response
    dispatch({
      type: 'UPLOAD_CONTENT',
      data
    })
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadQuestion = question => async(dispatch) => {
  try {
    const {data} = await request.post(`${API_URL}/question`, {question}, auth())
    return dispatch({
      type: 'UPLOAD_CONTENT',
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

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
    case 'question':
      params = {content: comment, rootId: parent.id, rootType: 'question'}
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

  return request.post(`${API_URL}/${commentType}`, params, auth()).then(
    response => {
      const {data} = response
      const action = (contentType === 'comment') ? {
        type: 'UPLOAD_FEED_REPLY',
        data: {
          reply: {...data.result, replies: []},
          type: parent.type,
          contentId: parent.id
        }
      } : {
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
    request.post(`${API_URL}/replies`, params, auth()).then(
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
  dispatch => request.post(`${API_URL}/targetContentComment`, params, auth()).then(
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
