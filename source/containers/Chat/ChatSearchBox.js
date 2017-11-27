import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import SearchInput from 'components/Texts/SearchInput'
import {stringIsEmpty} from 'helpers/stringHelpers'
import {searchChatAsync, clearChatSearchResults, enterChannelWithId} from 'redux/actions/ChatActions'
import {openNewChatTab} from 'redux/actions/ChatActions/actions'

class ChatSearchBox extends Component {
  static propTypes = {
    clearSearchResults: PropTypes.func.isRequired,
    enterChannelWithId: PropTypes.func.isRequired,
    openNewChatTab: PropTypes.func.isRequired,
    searchChat: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    userId: PropTypes.number,
    username: PropTypes.string
  }

  timer = null

  state = {
    searchText: ''
  }

  render() {
    const {searchResults, clearSearchResults} = this.props
    const {searchText} = this.state
    return (
      <div className="row container-fluid">
        <SearchInput
          placeholder="Search for channels / users"
          onChange={this.onChatSearch}
          value={searchText}
          searchResults={searchResults}
          renderItemLabel={
            item => !item.primary || (item.primary && item.twoPeople) ?
              <span>{item.label} {item.subLabel && <small>{`(${item.subLabel})`}</small>}</span> :
              <span>{item.label}</span>
          }
          onClickOutSide={() => {
            this.setState({searchText: ''})
            clearSearchResults()
          }}
          onSelect={this.onSelect}
        />
      </div>
    )
  }

  onChatSearch = (text) => {
    const {searchChat, clearSearchResults} = this.props
    window.clearTimeout(this.timer)
    this.setState({searchText: text})
    if (stringIsEmpty(text) || text.length < 2) {
      return clearSearchResults()
    }
    this.timer = window.setTimeout(() => searchChat(text), 300)
  }

  onSelect = (item) => {
    const {enterChannelWithId, clearSearchResults, userId, username, openNewChatTab} = this.props
    if (item.primary || !!item.channelId) {
      enterChannelWithId(item.channelId, true)
    } else {
      openNewChatTab({username, userId}, {username: item.label, userId: item.userId})
    }
    this.setState({searchText: ''})
    clearSearchResults()
  }
}

export default connect(
  state => ({
    searchResults: state.ChatReducer.chatSearchResults,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username
  }),
  {
    searchChat: searchChatAsync,
    clearSearchResults: clearChatSearchResults,
    enterChannelWithId,
    openNewChatTab
  }
)(ChatSearchBox)
