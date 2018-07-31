import SEARCH from '../constants/Search'

export const changeFilter = filter => ({
  type: SEARCH.CHANGE_FILTER,
  filter
})

export const changeSearch = text => ({
  type: SEARCH.CHANGE_INPUT,
  text
})

export const closeSearch = () => ({
  type: SEARCH.CLOSE
})

export const initSearch = () => ({
  type: SEARCH.INIT
})

export const setResults = results => ({
  type: SEARCH.SET_RESULTS,
  results
})
