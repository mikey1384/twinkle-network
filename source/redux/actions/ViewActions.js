import { resetMsgUnreadsOnTabSwitch } from './ChatActions'
import VIEW from '../constants/View'

export const changePageVisibility = visible => dispatch => {
  dispatch(resetMsgUnreadsOnTabSwitch())
  dispatch({
    type: VIEW.CHANGE_PAGE_VISIBILITY,
    visible
  })
}
