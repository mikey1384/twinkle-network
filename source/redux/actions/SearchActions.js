import SEARCH from '../constants/Search'

export const onChangeInput = text => ({
  type: SEARCH.CHANGE_INPUT,
  text
})
