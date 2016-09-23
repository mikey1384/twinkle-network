import request from 'axios';
import {auth, handleError} from './constants';
import {URL} from 'constants/URL';

const API_URL = `${URL}/feed`;

export const fetchFeeds = data => ({
  type: 'FETCH_FEEDS',
  data
})

export const fetchFeedsAsync = () => dispatch => {
  request.get(API_URL).then(
    response => {
      dispatch(fetchFeeds(response.data))
    }
  ).catch(
    error => {
      console.error(error)
      handleError(error, dispatch)
    }
  )
}

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
    console.error(error)
    handleError(error, dispatch)
  }
)

export const likeSiblingVideoComment = data => ({
  type: 'FEED_SIBLING_VIDEO_COMMENT_LIKE',
  data
})

export const likeSiblingVideoCommentAsync = contentId => dispatch =>
request.post(`${URL}/video/comments/like`, {commentId: contentId}, auth())
.then(
  response => {
    const {data} = response;
    if (data.likes) {
      dispatch(likeSiblingVideoComment({contentId, likes: data.likes}))
    }
    return;
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)
