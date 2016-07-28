import React, {Component, PropTypes} from 'react';

export default class InvitePeopleDropdown extends Component {
  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    onUnmount: PropTypes.func.isRequired,
    onAddUser: PropTypes.func.isRequired,
    dropdownItemToHighlight: PropTypes.number.isRequired,
    searchResults: PropTypes.array.isRequired
  }

  componentWillReceiveProps(nextProps) {
    let searchResultsChanged = false;
    if (this.props.searchResults.length !== nextProps.searchResults.length) {
      searchResultsChanged = true
    }
    else {
      for (let i = 0; i < nextProps.searchResults.length; i++) {
        if (nextProps.searchResults[i] !== this.props.searchResults[i]) {
          searchResultsChanged = true;
        }
      }
    }

    if (searchResultsChanged && (nextProps.dropdownItemToHighlight !== 0)) {
      this.props.onUpdate();
    }
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }

  render() {
    const {searchResults, dropdownItemToHighlight} = this.props;
    return (
      <ul
        className="dropdown-menu"
        style={{
          width: '100%',
          cursor: 'pointer',
          display: 'block'
        }}
      >
        {searchResults.map((user, index) => {
          let style = index === dropdownItemToHighlight ? {background: '#f5f5f5'} : null;
          return (
            <li
              key={index}
              onClick={() => this.props.onAddUser(user)}
              style={style}
            ><a>{user.username} {user.realName && <small>{`(${user.realName})`}</small>}</a></li>
          )
        })}
      </ul>
    )
  }
}
