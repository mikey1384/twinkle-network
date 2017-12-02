import {resetMsgUnreadsOnTabSwitch} from './ChatActions'

export const changePageVisibility = visible => dispatch => {
  dispatch(resetMsgUnreadsOnTabSwitch())
  dispatch({
    type: 'CHANGE_PAGE_VISIBILITY',
    visible
  })
}
