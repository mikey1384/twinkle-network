import request from 'axios';
import {auth, handleError} from './constants';
import {URL} from 'constants/URL';

const API_URL = `${URL}/feed`;

export const clearCategoriesSearchResults = () => ({
  type: 'CLEAR_CATEGORIES_SEARCH'
})

export const fetchCategories = data => ({
  type: 'FETCH_CATEGORIES',
  data
})

export const fetchCategoriesAsync = (searchText) => dispatch => {
  request.get(`${API_URL}/category?searchText=${searchText}`).then(
    response => dispatch(fetchCategories(response.data))
  )
}

export const fetchFeeds = data => ({
  type: 'FETCH_FEEDS',
  data
})

export const fetchFeedsAsync = () => dispatch => {
  request.get(API_URL).then(
    response => dispatch(fetchFeeds(response.data))
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const fetchMoreFeeds = data => ({
  type: 'FETCH_MORE_FEEDS',
  data
})

export const fetchMoreFeedsAsync = feedLength => dispatch => {
  request.get(`${API_URL}?feedLength=${feedLength}`).then(
    response => {
      dispatch(fetchMoreFeeds(response.data))
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const likeFeedVideoComment = data => ({
  type: 'FEED_VIDEO_COMMENT_LIKE',
  data
})

export const likeFeedVideoCommentAsync = commentId => dispatch =>
request.post(`${URL}/video/comments/like`, {commentId}, auth())
.then(
  response => {
    const {data} = response;
    if (data.likes) {
      dispatch(likeFeedVideoComment({contentId: commentId, likes: data.likes}))
    }
    return;
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const likeVideo = data => ({
  type: 'FEED_VIDEO_LIKE',
  data
})

export const likeVideoAsync = contentId => dispatch =>
request.post(`${URL}/video/like`, {videoId: contentId}, auth())
.then(
  response => {
    const {data} = response;
    if (data.likes) {
      dispatch(likeVideo({contentId, likes: data.likes}));
    }
    return;
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
    const {data} = response;
    if (data.likes) {
      dispatch(likeVideoComment({contentId, likes: data.likes}))
    }
    return;
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
    const {data} = response;
    if (data.likes) {
      dispatch(likeTargetVideoComment({contentId, likes: data.likes}))
    }
    return;
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadMoreFeedComments = data => ({
  type: 'LOAD_MORE_FEED_COMMENTS',
  data
})

export const loadMoreFeedCommentsAsync = (type, contentId, commentLength) => dispatch =>
request.get(
  `${API_URL}/comments?type=${type}&contentId=${contentId}&commentLength=${commentLength}`
).then(
  response => dispatch(loadMoreFeedComments({type, contentId, childComments: response.data}))
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const showFeedComments = data =>({
  type: 'SHOW_FEED_COMMENTS',
  data
})

export const showFeedCommentsAsync = (type, contentId, commentLength, isReply) => dispatch =>
request.get(
  `${API_URL}/comments?type=${type}&contentId=${contentId}&commentLength=${commentLength}&isReply=${isReply}`
)
.then(
  response => dispatch(showFeedComments({type, contentId, childComments: response.data}))
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

export const uploadContentAsync = params => dispatch =>
request.post(`${API_URL}/content`, {params}, auth())
.then(
  response => {
    const {data} = response;
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

export const uploadFeedVideoCommentAsync = (parent, commentContent) => dispatch => {
  const commentType = parent.type === 'comment' ? 'replies' : 'comments';
  const params = parent.type === 'comment' ?
  {reply: commentContent, videoId: parent.parentContentId, commentId: parent.commentId || parent.id, replyId: parent.commentId ? parent.id : null} : {comment: commentContent, videoId: parent.id};

  request.post(`${URL}/video/${commentType}`, params, auth())
  .then(
    response => {
      const {data} = response;
      const action = parent.type === 'comment' ? uploadFeedVideoReply({type: parent.type, contentId: parent.id, reply: {...data.result, replies: []}}) : uploadFeedVideoComment({...data, type: parent.type, contentId: parent.id})
      dispatch(action);
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const uploadFeedVideoReplyAsync = (parent, comment, replyContent) =>
dispatch => {
  const params = {reply: replyContent, videoId: parent.parentContentId, commentId: comment.commentId || comment.id, replyId: comment.commentId ? comment.id : null}

  request.post(`${URL}/video/replies`, params, auth())
  .then(
    response => {
      const {data} = response;
      const action = uploadFeedVideoReply({type: parent.type, contentId: parent.type === 'comment' ? comment.id : parent.id, reply: {...data.result, replies: []}, commentId: comment.id})
      dispatch(action);
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}
