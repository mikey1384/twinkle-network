import PropTypes from 'prop-types'
import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import SearchDropdown from '../SearchDropdown'
import Input from 'components/Texts/Input'
import { Color } from 'constants/css'
import { css } from 'emotion'

class TagInput extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClickOutSide: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    selectedUsers: PropTypes.array.isRequired,
    style: PropTypes.object,
    onAddUser: PropTypes.func.isRequired
  }

  handleClickOutside = event => {
    this.props.onClickOutSide()
  }

  constructor() {
    super()
    this.state = {
      indexToHighlight: 0
    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  render() {
    const { className, style } = this.props
    return (
      <div
        className={`${css`
          display: flex;
          align-items: center;
          height: 4.3rem;
          position: relative;
          .addon {
            border: 1px solid ${Color.inputBorderGray()};
            align-self: stretch;
            padding: 0 1rem;
            display: flex;
            align-items: center;
          }
          .glyphicon {
            line-height: 4rem;
            font-size: 1.5rem;
          }
          input {
            height: 100%;
            border: 1px solid ${Color.inputBorderGray()};
            border-left: none;
          }
        `} ${className}`}
        style={style}
      >
        <div className="addon" style={{ background: Color.borderGray() }}>
          <span className="glyphicon glyphicon-search" />
        </div>
        <Input
          autoFocus={this.props.autoFocus}
          value={this.props.value}
          placeholder="Search and select people you want to chat with"
          onChange={text => this.props.onChange(text)}
          onKeyDown={this.onKeyDown}
        />
        {this.renderDropdownList()}
      </div>
    )
  }

  renderDropdownList() {
    let { searchResults, selectedUsers } = this.props
    searchResults = searchResults.filter(user => {
      let result = true
      for (let i = 0; i < selectedUsers.length; i++) {
        if (selectedUsers[i].userId === user.id) {
          result = false
          break
        }
      }
      return result
    })
    return searchResults.length > 0 ? (
      <SearchDropdown
        searchResults={searchResults}
        onUpdate={() => this.setState({ indexToHighlight: 0 })}
        onUnmount={() => this.setState({ indexToHighlight: 0 })}
        indexToHighlight={this.state.indexToHighlight}
        onItemClick={user => this.props.onAddUser(user)}
        renderItemLabel={item => (
          <span>
            {item.username}{' '}
            {item.realName && <small>{`(${item.realName})`}</small>}
          </span>
        )}
      />
    ) : null
  }

  onKeyDown(event) {
    let { searchResults, selectedUsers } = this.props
    searchResults = searchResults.filter(user => {
      let result = true
      for (let i = 0; i < selectedUsers.length; i++) {
        if (selectedUsers[i].userId === user.id) {
          result = false
          break
        }
      }
      return result
    })
    const { indexToHighlight } = this.state
    let index = indexToHighlight
    if (searchResults.length > 0) {
      if (event.keyCode === 40) {
        event.preventDefault()
        let highlightIndex = Math.min(++index, searchResults.length - 1)
        this.setState({ indexToHighlight: highlightIndex })
      }

      if (event.keyCode === 38) {
        event.preventDefault()
        let highlightIndex = Math.max(--index, 0)
        this.setState({ indexToHighlight: highlightIndex })
      }

      if (event.keyCode === 13) {
        event.preventDefault()
        let user = searchResults[index]
        this.props.onAddUser(user)
      }
    }
  }
}

export default onClickOutside(TagInput)
