const defaultState = {
  links: [],
  loadMoreLinksButtonShown: false
}

export default function linkReducer(state = defaultState, action) {
  let loadMoreLinksButtonShown = false
  switch (action.type) {
    case 'FETCH_LINKS':
      if (action.links.length > 20) {
        loadMoreLinksButtonShown = true
        action.links.pop()
      }
      return {
        ...state,
        links: action.links,
        loadMoreLinksButtonShown
      }
    case 'FETCH_MORE_LINKS':
      if (action.links.length > 20) {
        loadMoreLinksButtonShown = true
        action.links.pop()
      }
      return {
        ...state,
        links: state.links.concat(action.links),
        loadMoreLinksButtonShown
      }
    default:
      return state
  }
}
