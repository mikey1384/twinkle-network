import request from 'axios'
import {auth, handleError} from './constants'
import {URL} from 'constants/URL'
import {push} from 'react-router-redux'
const API_URL = `${URL}/url`

export const likeComment = commentId => dispatch =>
  request.post(`${API_URL}/comments/like`, {commentId}, auth())
    .then(
      response => {
        const {data} = response
        if (data.likes) {
          dispatch({
            type: 'LIKE_LINK_COMMENT',
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

export const deleteComment = commentId => dispatch =>
  request.delete(`${API_URL}/comments?commentId=${commentId}`, auth())
    .then(
      response => dispatch({
        type: 'DELETE_LINK_COMMENT',
        commentId
      })
    ).catch(
      error => {
        console.error(error.response || error)
        handleError(error, dispatch)
      }
    )

export const deleteLink = linkId => dispatch =>
  request.delete(`${API_URL}/page?linkId=${linkId}`, auth()).then(
    response => dispatch({
      type: 'DELETE_LINK',
      linkId
    })
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const deleteLinkFromPage = linkId => dispatch =>
  request.delete(`${API_URL}/page?linkId=${linkId}`, auth()).then(
    response => {
      dispatch(push('/links'))
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const editComment = (params) => dispatch =>
  request.put(`${API_URL}/comments`, params, auth()).then(
    ({data}) => {
      dispatch({
        type: 'EDIT_LINK_COMMENT',
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

export const editLinkPage = (params) => dispatch =>
  request.put(`${API_URL}/page`, params, auth()).then(
    response => {
      dispatch({
        type: 'EDIT_LINK_PAGE',
        data: params
      })
      return Promise.resolve()
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const editTitle = (params) => dispatch =>
  request.put(`${API_URL}/title`, params, auth()).then(
    response => {
      dispatch({
        type: 'EDIT_LINK_TITLE',
        data: params
      })
      return Promise.resolve()
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const fetchLinks = () => dispatch =>
  request.get(API_URL).then(
    response => {
      dispatch({
        type: 'FETCH_LINKS',
        links: response.data
      })
      return Promise.resolve()
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const fetchMoreLinks = linkId => dispatch =>
  request.get(`${API_URL}?linkId=${linkId}`).then(
    response => {
      dispatch({
        type: 'FETCH_MORE_LINKS',
        links: response.data
      })
      return Promise.resolve()
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const fetchComments = linkId => dispatch =>
  request.get(`${API_URL}/comments?rootId=${linkId}&rootType=url`).then(
    response => {
      dispatch({
        type: 'FETCH_LINK_COMMENTS',
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

export const fetchMoreComments = (linkId, lastCommentId) => dispatch =>
  request.get(`${API_URL}/comments?rootId=${linkId}&lastCommentId=${lastCommentId}&rootType=url`)
    .then(
      response => dispatch({
        type: 'FETCH_MORE_LINK_COMMENTS',
        data: response.data
      })
    ).catch(
      error => {
        console.error(error.response || error)
        handleError(error, dispatch)
      }
    )

export const fetchMoreReplies = (lastReplyId, commentId) => dispatch =>
  request.get(`${API_URL}/replies?lastReplyId=${lastReplyId}&commentId=${commentId}&rootType=url`)
    .then(
      response => dispatch({
        type: 'FETCH_MORE_LINK_REPLIES',
        data: response.data,
        commentId
      })
    ).catch(
      error => {
        console.error(error.response || error)
        handleError(error, dispatch)
      }
    )

export const likeLink = linkId => dispatch =>
  request.post(`${API_URL}/like`, {contentId: linkId}, auth()).then(
    response => dispatch({
      type: 'LIKE_LINK',
      likes: response.data.likes
    })
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const loadLinkPage = linkId => dispatch =>
  request.get(`${API_URL}/page?linkId=${linkId}`).then(
    response => {
      dispatch({
        type: 'LOAD_LINK_PAGE',
        page: response.data
      })
      return Promise.resolve()
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const submitReply = ({replyContent, comment, parent, replyOfReply}) =>
  dispatch => {
    const params = {
      content: replyContent,
      rootId: parent.id,
      rootType: 'url',
      commentId: comment.commentId || comment.id,
      replyId: comment.commentId ? comment.id : null
    }
    request.post(`${API_URL}/replies`, params, auth())
      .then(
        response => {
          const {data} = response
          dispatch({
            type: 'SUBMIT_LINK_REPLY',
            data: {
              reply: {
                ...data.result,
                replyOfReply,
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

export const submitComment = ({content, linkId: rootId}) => dispatch =>
  request.post(`${API_URL}/comments`, {content, rootId, rootType: 'url'}, auth()).then(
    response => dispatch({
      type: 'SUBMIT_LINK_COMMENT',
      comment: response.data
    })
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const uploadLink = ({url, title, description}) => dispatch =>
  request.post(`${API_URL}`, {url, title, description}, auth()).then(
    ({data: linkItem}) => {
      dispatch({
        type: 'UPLOAD_LINK',
        linkItem
      })
      return Promise.resolve()
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
