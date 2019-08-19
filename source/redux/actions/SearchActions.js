import SEARCH from '../constants/Search';

export const changeSearch = text => ({
  type: SEARCH.CHANGE_INPUT,
  text
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
