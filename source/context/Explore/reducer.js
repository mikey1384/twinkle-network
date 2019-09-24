export default function ExploreReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_SEARCH_INPUT':
      return {
        ...state,
        search: {
          ...state.search,
          searchText: action.text
        }
      };
    case 'CLEAR_LINKS_LOADED':
      return {
        ...state,
        links: {
          ...state.links,
          loaded: false
        }
      };
    case 'DELETE_LINK':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.filter(link => link.id !== action.linkId)
        }
      };
    case 'EDIT_LINK_PAGE':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.map(link =>
            action.id === link.id
              ? {
                  ...link,
                  title: action.title,
                  content: action.content
                }
              : link
          )
        }
      };
    case 'EDIT_LINK_TITLE':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.map(link => ({
            ...link,
            title: action.data.id === link.id ? action.data.title : link.title
          }))
        }
      };
    case 'LIKE_LINK':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.map(link =>
            action.id === link.id
              ? {
                  ...link,
                  likes: action.likes
                }
              : link
          )
        }
      };
    case 'LOAD_LINKS':
      return {
        ...state,
        links: {
          ...state.links,
          loaded: true,
          links: action.links,
          loadMoreLinksButtonShown: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_LINKS':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.concat(action.links),
          loadMoreLinksButtonShown: action.loadMoreButton
        }
      };
    case 'LOAD_FEATURED_SUBJECTS':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          featured: action.subjects,
          loaded: true
        }
      };
    case 'LOAD_SEARCH_RESULTS':
      return {
        ...state,
        search: {
          ...state.search,
          results: action.results,
          loadMoreButton: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_SEARCH_RESULTS':
      return {
        ...state,
        search: {
          ...state.search,
          results: state.search.results.concat(action.results),
          loadMoreButton: action.loadMoreButton
        }
      };
    case 'RELOAD_SUBJECTS':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          loaded: false
        }
      };
    case 'UPDATE_NUM_LINK_COMMENTS':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.map(link =>
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
        }
      };
    case 'UPLOAD_LINK':
      return {
        ...state,
        links: {
          ...state.links,
          links: [action.linkItem].concat(state.links.links)
        }
      };
    default:
      return state;
  }
}
