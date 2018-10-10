import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { stringIsEmpty } from 'helpers/stringHelpers';
import TagInput from './TagInput';
import { objectify } from 'helpers';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import Tag from './Tag';

export default class TagForm extends Component {
  static propTypes = {
    itemLabel: PropTypes.string.isRequired,
    searchPlaceholder: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
    selectedItems: PropTypes.array.isRequired,
    filter: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.array,
      PropTypes.node
    ]),
    onSubmit: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    renderDropdownLabel: PropTypes.func.isRequired,
    renderTagLabel: PropTypes.func,
    title: PropTypes.string,
    videoId: PropTypes.number
  };

  timer = null;

  state = {
    addPlaylistModalShown: false,
    loading: false,
    searchText: ''
  };

  componentWillUnmount() {
    const { onClear } = this.props;
    onClear();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchResults !== this.props.searchResults) {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      searchResults,
      onClear,
      selectedItems,
      filter,
      onSubmit,
      children,
      renderDropdownLabel,
      searchPlaceholder,
      title,
      videoId
    } = this.props;
    const { addPlaylistModalShown, loading } = this.state;
    const { searchText } = this.state;
    const filteredResults = searchResults.filter(filter);
    return (
      <>
        <form
          style={{ width: '70%' }}
          onSubmit={event => {
            event.preventDefault();
            onSubmit?.();
          }}
        >
          <div style={{ width: '100%' }}>
            {title && <h3>{title}</h3>}
            {this.renderTags()}
            <TagInput
              style={{ marginTop: selectedItems.length === 0 ? '1rem' : 0 }}
              autoFocus
              loading={loading}
              value={searchText}
              onChange={this.onItemSearch}
              onClickOutSide={() => {
                this.setState({ searchText: '' });
                onClear();
              }}
              placeholder={searchPlaceholder}
              renderDropdownLabel={renderDropdownLabel}
              searchResults={filteredResults}
              selectedItems={objectify(selectedItems)}
              onAddItem={this.onAddItem}
              showAddPlaylistModal={() =>
                this.setState({ addPlaylistModalShown: true })
              }
              videoId={videoId}
            />
          </div>
          {children}
        </form>
        {addPlaylistModalShown && (
          <AddPlaylistModal
            excludeVideoIds={[videoId]}
            postPlaylist={this.onAddPlaylist}
            onHide={() => this.setState({ addPlaylistModalShown: false })}
          />
        )}
      </>
    );
  }

  onAddPlaylist = playlist => {
    const { onAddItem } = this.props;
    onAddItem(playlist);
    this.setState({ addPlaylistModalShown: false });
  };

  renderTags = () => {
    const {
      itemLabel,
      selectedItems,
      onRemoveItem,
      renderTagLabel
    } = this.props;
    return selectedItems.length > 0 ? (
      <div
        style={{
          marginTop: '1rem'
        }}
      >
        {selectedItems.map((item, index) => {
          return (
            <Tag
              key={item.id}
              index={index}
              label={item[itemLabel]}
              onClick={() => onRemoveItem(item.id)}
              renderTagLabel={renderTagLabel}
            />
          );
        })}
      </div>
    ) : null;
  };

  onItemSearch = text => {
    const { onSearch, onClear } = this.props;
    clearTimeout(this.timer);
    this.setState({ searchText: text, loading: false });
    if (stringIsEmpty(text) || text.length < 2) {
      return onClear();
    }
    this.setState({ loading: true });
    this.timer = setTimeout(() => onSearch(text), 300);
  };

  onAddItem = item => {
    this.setState({ searchText: '' });
    this.props.onAddItem(item);
    this.props.onClear();
  };
}
