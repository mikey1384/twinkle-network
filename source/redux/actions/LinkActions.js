import request from 'axios';
import { auth, handleError } from 'helpers/requestHelpers';
import LINK from '../constants/Link';
import URL from 'constants/URL';

const API_URL = `${URL}/url`;

export const deleteLink = linkId => async dispatch => {
  try {
    await request.delete(`${API_URL}?linkId=${linkId}`, auth());
    dispatch({
      type: LINK.DELETE,
      linkId
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editLinkPage = ({ id, title, content }) => ({
  type: LINK.EDIT_PAGE,
  id,
  title,
  content
});

export const editTitle = params => async dispatch => {
  try {
    await request.put(`${API_URL}/title`, params, auth());
    dispatch({
      type: LINK.EDIT_TITLE,
      data: params
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const fetchLinks = ({ links, loadMoreButton }) => ({
  type: LINK.LOAD,
  links,
  loadMoreButton
});

export const fetchMoreLinks = ({ links, loadMoreButton }) => ({
  type: LINK.LOAD_MORE,
  links,
  loadMoreButton
});

export const likeLink = ({ id, likes }) => ({
  type: LINK.LIKE,
  id,
  likes
});

export const updateNumComments = ({ id, updateType }) => ({
  type: LINK.UPDATE_NUM_COMMENTS,
  id,
  updateType
});

export const uploadLink = ({ url, title, description }) => async dispatch => {
  try {
    const { data: linkItem } = await request.post(
      `${API_URL}`,
      { url, title, description },
      auth()
    );
    dispatch({
      type: LINK.UPLOAD,
      linkItem
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};
