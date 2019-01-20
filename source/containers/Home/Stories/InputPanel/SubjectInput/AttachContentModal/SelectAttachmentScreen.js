import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'components/Texts/SearchInput';
import SelectUploadsForm from 'components/Forms/SelectUploadsForm';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { loadUploads, searchContent } from 'helpers/requestHelpers';

export default class SelectAttachmentScreen extends Component {
  state = {
    allUploads: [],
    loadMoreButton: false,
    searchedUploads: [],
    searchLoadMoreButton: false,
    searchText: '',
    selectedUpload: []
  };

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
  };

  timer = null;

  async componentDidMount() {
    const { type } = this.props;
    const { results, loadMoreButton } = await loadUploads({
      limit: 18,
      type
    });
    this.setState({
      allUploads: results,
      loadMoreButton
    });
  }

  render() {
    const {
      allUploads,
      loadMoreButton,
      searchedUploads,
      searchText,
      searchLoadMoreButton,
      selectedUpload
    } = this.state;
    const { onSelect, onDeselect, type } = this.props;

    return (
      <div style={{ width: '100%' }}>
        <SearchInput
          placeholder="Search..."
          autoFocus
          style={{
            marginBottom: '2em',
            width: '50%'
          }}
          value={searchText}
          onChange={this.onSearchInput}
        />
        <SelectUploadsForm
          type={type}
          uploads={!stringIsEmpty(searchText) ? searchedUploads : allUploads}
          selectedUploads={selectedUpload}
          loadMoreButton={
            !stringIsEmpty(searchText) ? searchLoadMoreButton : loadMoreButton
          }
          onSelect={upload => {
            this.setState({
              selectedUpload: [upload]
            });
            onSelect(upload);
          }}
          onDeselect={() => {
            this.setState({
              selectedUpload: []
            });
            onDeselect();
          }}
          loadMoreUploads={this.loadMoreUploads}
        />
      </div>
    );
  }

  loadMoreUploads = async() => {
    const { type } = this.props;
    const { allUploads, selectedUpload, searchText } = this.state;
    if (!stringIsEmpty(searchText)) {
      const { results, loadMoreButton } = await searchContent({
        filter: type,
        searchText,
        shownResults: selectedUpload
      });
      this.setState(state => ({
        searchedUploads: state.searchedUploads.concat(results),
        searchLoadMoreButton: loadMoreButton
      }));
    } else {
      const { results, loadMoreButton } = await loadUploads({
        limit: 18,
        type,
        contentId: allUploads[allUploads.length - 1].id
      });
      this.setState(state => ({
        allUploads: state.allUploads.concat(results),
        loadMoreButton
      }));
    }
  };

  onSearchInput = text => {
    clearTimeout(this.timer);
    this.setState({ searchText: text });
    this.timer = setTimeout(() => this.search(text), 300);
  };

  search = async text => {
    const { type } = this.props;
    const { results: searchedUploads, loadMoreButton } = await searchContent({
      filter: type,
      searchText: text
    });
    this.setState({ searchedUploads, searchLoadMoreButton: loadMoreButton });
  };
}
