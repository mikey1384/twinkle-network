import React, {Component} from 'react';
import onClickOutside from 'react-onclickoutside';
import Dropdown from './Dropdown';

class TagPeopleInput extends Component {
  constructor() {
    super()
    this.state = {
      dropdownItemToHighlight: 0
    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

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
          onKeyDown={this.onKeyDown}
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
    <Dropdown
      searchResults={searchResults}
      onUpdate={() => this.setState({dropdownItemToHighlight: 0})}
      onUnmount={() => this.setState({dropdownItemToHighlight: 0})}
      dropdownItemToHighlight={this.state.dropdownItemToHighlight}
      onAddUser={user => this.props.onAddUser(user)}
    /> : null
  }

  onKeyDown(event) {
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
    const {dropdownItemToHighlight} = this.state;
    let index = dropdownItemToHighlight;
    if (searchResults.length > 0) {
      if (event.keyCode === 40) {
        event.preventDefault();
        let highlightIndex = Math.min(++index, searchResults.length - 1)
        this.setState({dropdownItemToHighlight: highlightIndex})
      }

      if (event.keyCode === 38) {
        event.preventDefault();
        let highlightIndex = Math.max(--index, 0)
        this.setState({dropdownItemToHighlight: highlightIndex})
      }

      if (event.keyCode === 13) {
        event.preventDefault();
        let user = searchResults[index];
        this.props.onAddUser(user);
      }
    }
  }
}

export default onClickOutside(TagPeopleInput)
