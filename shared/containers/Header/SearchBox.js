import React, {Component} from 'react';
import {connect} from 'react-redux';
import SearchInput from 'components/SearchInput';
import {stringIsEmpty} from 'helpers/stringHelpers';
import {
  searchVideoAsync,
  clearSearchResults,
  loadVideoPageFromClientSideAsync
} from 'redux/actions/VideoActions';


@connect(
  state => ({
    searchResult: state.VideoReducer.searchResult
  }),
  {
    searchVideo: searchVideoAsync,
    loadVideoPage: loadVideoPageFromClientSideAsync,
    clearSearchResults
  }
)
export default class SearchBox extends Component {
  constructor() {
    super()
    this.state = {
      searchText: ''
    }
    this.onContentSearch = this.onContentSearch.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  render() {
    const {searchResult, clearSearchResults, className, style} = this.props;
    const {searchText} = this.state;
    return (
      <form className={className} style={style}>
        <SearchInput
          placeholder="Search for Videos"
          onChange={this.onContentSearch}
          value={searchText}
          searchResults={searchResult}
          renderItemLabel={
            item => <span>{item.label}</span>
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
    const {searchVideo, clearSearchResults} = this.props;
    const text = event.target.value;
    this.setState({searchText: text});
    if (stringIsEmpty(text)) {
      return clearSearchResults()
    }
    searchVideo(text);
  }

  onSelect(item) {
    const {clearSearchResults, loadVideoPage} = this.props;
    this.setState({searchText: ''})
    clearSearchResults();
    loadVideoPage(item.id, `videos/${item.id}`);
  }
}
