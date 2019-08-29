import LINK from '../constants/Link';

const defaultState = {
  loaded: false,
  links: [],
  loadMoreLinksButtonShown: false
};

export default function linkReducer(state = defaultState, action) {
  switch (action.type) {
    case LINK.CLEAR_LOADED:
      return {
        ...state,
        loaded: false
      };
    case LINK.DELETE:
      return {
        ...state,
        links: state.links.filter(link => link.id !== action.linkId)
      };
    case LINK.EDIT_TITLE:
      return {
        ...state,
        links: state.links.map(link => ({
          ...link,
          title: action.data.id === link.id ? action.data.title : link.title
        }))
      };
    case LINK.EDIT_PAGE:
      return {
        ...state,
        links: state.links.map(link =>
          action.id === link.id
            ? {
                ...link,
                title: action.title,
                content: action.content
              }
            : link
        )
      };
    case LINK.LIKE:
      return {
        ...state,
        links: state.links.map(link =>
          action.id === link.id
            ? {
                ...link,
                likes: action.likes
              }
            : link
        )
      };
    case LINK.LOAD:
      return {
        ...state,
        loaded: true,
        links: action.links,
        loadMoreLinksButtonShown: action.loadMoreButton
      };
    case LINK.LOAD_MORE:
      return {
        ...state,
        links: state.links.concat(action.links),
        loadMoreLinksButtonShown: action.loadMoreButton
      };
    case LINK.UPDATE_NUM_COMMENTS:
      return {
        ...state,
        links: state.links.map(link =>
          action.id === link.id
            ? {
                ...link,
                numComments:
                  action.updateType === 'increase'
                    ? link.numComments + 1
                    : link.numComments - 1
              }
            : link
        )
      };
    case LINK.UPLOAD:
      return {
        ...state,
        links: [action.linkItem].concat(state.links)
      };
    default:
      return state;
  }
}
