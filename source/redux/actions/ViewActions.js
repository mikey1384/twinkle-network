import { resetMsgUnreadsOnTabSwitch } from './ChatActions'
import VIEW from '../constants/View'

export const changePageVisibility = visible => dispatch => {
  dispatch(resetMsgUnreadsOnTabSwitch())
  dispatch({
    type: VIEW.CHANGE_PAGE_VISIBILITY,
    visible
  })
}

export const hideMobileNavbar = () => ({
  type: VIEW.HIDE_MOBILE_NAVBAR
})

export const showMobileNavbar = () => ({
  type: VIEW.SHOW_MOBILE_NAVBAR
})
