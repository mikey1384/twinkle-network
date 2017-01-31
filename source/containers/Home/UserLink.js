import React, {PropTypes} from 'react'
import UsernameText from 'components/Texts/UsernameText'
import {Color} from 'constants/css'

UserLink.propTypes = {
  user: PropTypes.object
}
export default function UserLink(props) {
  return <UsernameText user={props.user} color={Color.blue} />
}
