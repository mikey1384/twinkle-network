import SEARCH from '../constants/Search'

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
