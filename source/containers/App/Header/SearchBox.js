import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import SearchInput from 'components/SearchInput'
import {stringIsEmpty} from 'helpers/stringHelpers'
import {loadVideoPageFromClientSideAsync} from 'redux/actions/VideoActions'
import {clearSearchResults, searchContent} from 'redux/actions/ContentActions'
import {Color} from 'constants/css'

@connect(
  state => ({
    searchResult: state.ContentReducer.searchResult
  }),
  {
    searchContent,
    loadVideoPage: loadVideoPageFromClientSideAsync,
    clearSearchResults
  }
)
@withRouter
export default class SearchBox extends Component {
  static propTypes = {
    history: PropTypes.object,
    searchResult: PropTypes.array,
    clearSearchResults: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    searchContent: PropTypes.func,
    loadVideoPage: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      searchText: ''
    }
    this.onContentSearch = this.onContentSearch.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  render() {
    const {searchResult, clearSearchResults, className, style} = this.props
    const {searchText} = this.state
    return (
      <form className={className} style={style}>
        <SearchInput
          placeholder="Search for Videos and Links"
          onChange={this.onContentSearch}
          value={searchText}
          searchResults={searchResult}
          renderItemLabel={
            item => <div>
              <span
                style={{
                  color: item.type === 'video' ? Color.logoBlue : Color.pink,
                  fontWeight: 'bold'
                }}
              >
                [{item.type === 'video' ? 'Video' : 'Link'}]
              </span>&nbsp;&nbsp;&nbsp;{item.label}
            </div>
          }
          onClickOutSide={() => {
            this.setState({searchText: ''})
            clearSearchResults()
          }}
          onSelect={this.onSelect}
        />
      </form>
    )
  }

  onContentSearch(event) {
    const {searchContent, clearSearchResults} = this.props
    const text = event.target.value
    this.setState({searchText: text})
    if (stringIsEmpty(text)) {
      return clearSearchResults()
    }
    searchContent(text)
  }

  onSelect(item) {
    const {clearSearchResults, loadVideoPage, history} = this.props
    this.setState({searchText: ''})
    clearSearchResults()
    return loadVideoPage(item.id).then(
      () => history.push(`/${item.type}s/${item.id}`)
    )
  }
}
