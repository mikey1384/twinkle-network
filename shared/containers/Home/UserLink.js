import React from 'react';
import UsernameText from 'components/UsernameText';
import {Color} from 'constants/css';

export default function UserLink(props) {
  return <UsernameText user={props.user} color={Color.blue} />
}
