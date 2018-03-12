import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { stringIsEmpty } from 'helpers/stringHelpers'
import TagInput from './TagInput'
import { borderRadius } from 'constants/css'

export default class TagPeopleForm extends Component {
  static propTypes = {
    searchResults: PropTypes.array.isRequired,
    selectedUsers: PropTypes.array.isRequired,
    filter: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onAddUser: PropTypes.func.isRequired,
    onRemoveUser: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.array,
      PropTypes.node
    ]),
    onSubmit: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
  }

  timer = null

  state = {
    searchText: ''
  }

  componentWillUnmount() {
    const { onClear } = this.props
    onClear()
  }

  render() {
    const {
      searchResults,
      onClear,
      selectedUsers,
      filter,
      onSubmit,
      children
    } = this.props
    const { searchText } = this.state
    const filteredResults = searchResults.filter(filter)
    return (
      <form
        style={{ width: '70%' }}
        onSubmit={event => {
          event.preventDefault()
          onSubmit && onSubmit()
        }}
      >
        <div style={{ width: '100%' }}>
          <h3>People</h3>
          {this.renderTags()}
          <TagInput
            style={{ marginTop: '1rem' }}
            autoFocus
            value={searchText}
            onChange={this.onUserSearch}
            onClickOutSide={() => {
              this.setState({ searchText: '' })
              onClear()
            }}
            searchResults={filteredResults}
            selectedUsers={selectedUsers}
            onAddUser={this.onAddUser}
          />
        </div>
        {children}
      </form>
    )
  }

  renderTags = () => {
    const { selectedUsers, onRemoveUser } = this.props
    return selectedUsers.length > 0 ? (
      <div
        style={{
          margin: '1rem 0'
        }}
      >
        {selectedUsers.map((user, index) => {
          return (
            <span
              key={index}
              style={{
                marginLeft: index > 0 && '0.2em',
                backgroundColor: '#18aae0',
                color: '#fff',
                paddingTop: '3px',
                paddingBottom: '3px',
                paddingLeft: '8px',
                paddingRight: '8px',
                borderRadius,
                cursor: 'pointer'
              }}
              onClick={() => onRemoveUser(user)}
            >
              {user.username} &times;
            </span>
          )
        })}
      </div>
    ) : null
  }

  onUserSearch = text => {
    const { onSearch, onClear } = this.props
    clearTimeout(this.timer)
    this.setState({ searchText: text })
    if (stringIsEmpty(text) || text.length < 2) {
      return onClear()
    }
    this.timer = setTimeout(() => onSearch(text), 300)
  }

  onAddUser = user => {
    this.setState({ searchText: '' })
    this.props.onAddUser(user)
    this.props.onClear()
  }
}
