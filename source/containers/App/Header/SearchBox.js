import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SearchInput from 'components/Texts/SearchInput'
import { stringIsEmpty, cleanString } from 'helpers/stringHelpers'
import { loadVideoPageFromClientSideAsync } from 'redux/actions/VideoActions'
import { loadLinkPage } from 'redux/actions/LinkActions'
import { clearSearchResults, searchContent } from 'redux/actions/ContentActions'
import { Color } from 'constants/css'
import { recordUserAction } from 'helpers/userDataHelpers'

class SearchBox extends Component {
  static propTypes = {
    className: PropTypes.string,
    clearSearchResults: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loadLinkPage: PropTypes.func.isRequired,
    loadVideoPage: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool,
    searchContent: PropTypes.func.isRequired,
    searchResult: PropTypes.array.isRequired,
    style: PropTypes.object
  }

  state = {
    searchText: ''
  }

  timer = null

  render() {
    const { searchResult, clearSearchResults, className, style } = this.props
    const { searchText } = this.state
    return (
      <div
        className={className}
        style={style}
      >
        <SearchInput
          placeholder="Search for Videos and Links"
          onChange={this.onContentSearch}
          value={searchText}
          searchResults={searchResult}
          renderItemLabel={item => (
            <div>
              <div
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  lineHeight: 'normal'
                }}
              >
                <span
                  style={{
                    color: item.type === 'video' ? Color.logoBlue : Color.pink,
                    fontWeight: 'bold'
                  }}
                >
                  [{item.type === 'video' ? 'Video' : 'Link'}]
                </span>&nbsp;&nbsp;&nbsp;<span>{cleanString(item.label)}</span>
              </div>
            </div>
          )}
          renderItemUrl={item => `/${item.type}s/${item.id}`}
          onClickOutSide={() => {
            this.setState({ searchText: '' })
            clearSearchResults()
          }}
          onSelect={this.onSelect}
        />
      </div>
    )
  }

  onContentSearch = text => {
    const { searchContent, clearSearchResults } = this.props
    clearTimeout(this.timer)
    this.setState({ searchText: text })
    if (stringIsEmpty(text)) {
      return clearSearchResults()
    }
    this.timer = setTimeout(() => searchContent(text), 300)
  }

  onSelect = item => {
    const {
      clearSearchResults,
      loadVideoPage,
      loadLinkPage,
      history,
      loggedIn,
      location: { pathname }
    } = this.props
    this.setState({ searchText: '' })
    clearSearchResults()
    if (loggedIn) {
      recordUserAction({
        action: 'search',
        target: item.type,
        subTarget: item.id
      })
    }
    if (pathname === `/${item.type}s/${item.id}`) return
    if (item.type === 'video') {
      return loadVideoPage(item.id).then(() =>
        history.push(`/${item.type}s/${item.id}`)
      )
    } else {
      return loadLinkPage(item.id).then(() =>
        history.push(`/${item.type}s/${item.id}`)
      )
    }
  }
}

export default connect(
  state => ({
    searchResult: state.ContentReducer.searchResult,
    loggedIn: state.UserReducer.loggedIn
  }),
  {
    searchContent,
    loadVideoPage: loadVideoPageFromClientSideAsync,
    loadLinkPage,
    clearSearchResults
  }
)(withRouter(SearchBox))
