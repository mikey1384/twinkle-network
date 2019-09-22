import LINK from '../constants/Link';

export const clearLinksLoaded = () => ({
  type: LINK.CLEAR_LOADED
});

export const onDeleteLink = linkId => ({
  type: LINK.DELETE,
  linkId
});

export const editLinkPage = ({ id, title, content }) => ({
  type: LINK.EDIT_PAGE,
  id,
  title,
  content
});

export const onEditTitle = params => ({
  type: LINK.EDIT_TITLE,
  data: params
});

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

export const onUploadLink = linkItem => ({
  type: LINK.UPLOAD,
  linkItem
});
