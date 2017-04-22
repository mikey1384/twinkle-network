import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import SearchInput from 'components/SearchInput'
import {stringIsEmpty} from 'helpers/stringHelpers'
import {searchChatAsync, clearChatSearchResults, enterChannelWithId} from 'redux/actions/ChatActions'
import {openNewChatTab} from 'redux/actions/ChatActions/actions'

@connect(
  state => ({
    searchResult: state.ChatReducer.chatSearchResult,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username
  }),
  {
    searchChat: searchChatAsync,
    clearSearchResults: clearChatSearchResults,
    enterChannelWithId,
    openNewChatTab
  }
)
export default class ChatSearchBox extends Component {
  static propTypes = {
    searchResult: PropTypes.array,
    searchChat: PropTypes.func,
    clearSearchResults: PropTypes.func,
    enterChannelWithId: PropTypes.func,
    userId: PropTypes.number,
    username: PropTypes.string,
    openNewChatTab: PropTypes.func
  }
  constructor() {
    super()
    this.state = {
      searchText: ''
    }
    this.onChatSearch = this.onChatSearch.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  render() {
    const {searchResult, clearSearchResults} = this.props
    const {searchText} = this.state
    return (
      <div className="row container-fluid">
        <SearchInput
          placeholder="Search for channels / users"
          onChange={this.onChatSearch}
          value={searchText}
          searchResults={searchResult}
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

  onChatSearch(event) {
    const {searchChat, clearSearchResults} = this.props
    const text = event.target.value
    this.setState({searchText: text})
    if (stringIsEmpty(text) || text.length < 2) {
      return clearSearchResults()
    }
    searchChat(text)
  }

  onSelect(item) {
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
