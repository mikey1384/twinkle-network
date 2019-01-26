import LINK from '../constants/Link';

const defaultState = {
  links: [],
  loadMoreLinksButtonShown: false
};

export default function linkReducer(state = defaultState, action) {
  let loadMoreLinksButtonShown = false;
  switch (action.type) {
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
    case LINK.LOAD:
      if (action.links.length > 20) {
        loadMoreLinksButtonShown = true;
        action.links.pop();
      }
      return {
        ...state,
        links: action.links,
        loadMoreLinksButtonShown
      };
    case LINK.LOAD_MORE:
      if (action.links.length > 20) {
        loadMoreLinksButtonShown = true;
        action.links.pop();
      }
      return {
        ...state,
        links: state.links.concat(action.links),
        loadMoreLinksButtonShown
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
    case LINK.UPLOAD:
      return {
        ...state,
        links: [action.linkItem].concat(state.links)
      };
    default:
      return state;
  }
}
