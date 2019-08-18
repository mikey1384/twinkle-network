import SEARCH from '../constants/Search';

export const changeFilter = filter => ({
  type: SEARCH.CHANGE_FILTER,
  filter
});

export const changeSearch = text => ({
  type: SEARCH.CHANGE_INPUT,
  text
});

export const closeSearch = () => ({
  type: SEARCH.CLOSE
});

export const initSearch = () => ({
  type: SEARCH.INIT
});

export const setResults = ({ filter, results, loadMoreButton }) => ({
  type: SEARCH.SET_RESULTS,
  filter,
  results,
  loadMoreButton
});

export const showMoreResults = ({ results, loadMoreButton }) => ({
  type: SEARCH.LOAD_MORE_RESULTS,
  results,
  loadMoreButton
});
