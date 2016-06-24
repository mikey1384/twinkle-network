import React, {Component} from 'react';
import onClickOutside from 'react-onclickoutside';


class InvitePeopleInput extends Component {
  handleClickOutside = (event) => {
    this.props.onClickOutSide();
  }

  render() {
    return (
      <div className="input-group dropdown">
        <span className="input-group-addon">
          <span className="glyphicon glyphicon-search"></span>
        </span>
        <input
          value={this.props.value}
          className="form-control"
          placeholder="Search and select people you want to chat with"
          onChange={event => this.props.onChange(event)}
        />
        {this.renderDropdownList()}
      </div>
    )
  }

  renderDropdownList() {
    let {searchResults, selectedUsers} = this.props;
    searchResults = searchResults.filter(user => {
      let result = true;
      for (let i = 0; i < selectedUsers.length; i++) {
        if (selectedUsers[i].userId === user.id) {
          result = false;
          break;
        }
      }
      return result;
    })
    return searchResults.length > 0 ?
    <ul
      className="dropdown-menu"
      style={{
        width: '100%',
        cursor: 'pointer',
        display: 'block'
      }}
    >
      {searchResults.map((user, index) => {
        return (
          <li
            key={index}
            onClick={ () => this.props.onAddUser(user) }
          ><a>{user.realname} <small>{`(${user.username})`}</small></a></li>
        )
      })}
    </ul> : null
  }
}

export default onClickOutside(InvitePeopleInput)
