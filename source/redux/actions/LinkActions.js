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

export const fetchLinks = () => async dispatch => {
  try {
    const { data } = await request.get(API_URL);
    dispatch({
      type: LINK.LOAD,
      links: data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const fetchMoreLinks = linkId => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}?linkId=${linkId}`);
    dispatch({
      type: LINK.LOAD_MORE,
      links: data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const likeLink = ({ id, likes }) => ({
  type: LINK.LIKE,
  id,
  likes
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
