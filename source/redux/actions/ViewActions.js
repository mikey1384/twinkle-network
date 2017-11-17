import {resetMsgUnreadsOnTabSwitch} from './ChatActions'

export const changePageVisibility = visible => dispatch => {
  resetMsgUnreadsOnTabSwitch(visible)
  return dispatch({
    type: 'CHANGE_PAGE_VISIBILITY',
    visible
  })
}
