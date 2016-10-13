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
      console.error(error)
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
      console.error(error)
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
    const {data} = response;
    if (data.likes) {
      dispatch(likeVideo({contentId, likes: data.likes}));
    }
    return;
  }
).catch(
  error => {
    console.error(error)
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
    console.error(error)
    handleError(error, dispatch)
  }
)
