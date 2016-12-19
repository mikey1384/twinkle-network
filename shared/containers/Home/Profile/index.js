import React, {Component} from 'react';
import Header from './Header';
import Body from './Body';


export default class Profile extends Component {
  render() {
    return (
      <div>
        <Header {...this.props} />
        <Body {...this.props} />
      </div>
    )
  }
}
