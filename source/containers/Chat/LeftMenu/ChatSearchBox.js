import React from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import SearchInput from 'components/Texts/SearchInput';
import { connect } from 'react-redux';
import {
  searchChat,
  clearChatSearchResults,
  enterChannelWithId,
  openNewChatTab
} from 'redux/actions/ChatActions';

ChatSearchBox.propTypes = {
  clearSearchResults: PropTypes.func.isRequired,
  enterChannelWithId: PropTypes.func.isRequired,
  openNewChatTab: PropTypes.func.isRequired,
  searchChat: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string
};

function ChatSearchBox({
  clearSearchResults,
  enterChannelWithId,
  openNewChatTab,
  searchChat,
  searchResults,
  userId,
  username
}) {
  const { handleSearch, loading, searchText, setSearchText } = useSearch({
    onSearch: searchChat,
    onClear: clearSearchResults
  });

  return (
    <div style={{ padding: '0 1rem', zIndex: 5 }}>
      <SearchInput
        placeholder="Search for channels / users"
        onChange={handleSearch}
        value={searchText}
        searchResults={searchResults}
        renderItemLabel={item =>
          !item.primary || (item.primary && item.twoPeople) ? (
            <span>
              {item.label}{' '}
              {item.subLabel && <small>{`(${item.subLabel})`}</small>}
            </span>
          ) : (
            <span>{item.label}</span>
          )
        }
        onClickOutSide={() => {
          setSearchText('');
          clearSearchResults();
        }}
        onSelect={onSelect}
      />
      {loading && <Loading style={{ height: '7rem' }} />}
    </div>
  );

  function onSelect(item) {
    if (item.primary || !!item.channelId) {
      enterChannelWithId(item.channelId, true);
    } else {
      openNewChatTab(
        { username, id: userId },
        { username: item.label, id: item.id }
      );
    }
    setSearchText('');
    clearSearchResults();
  }
}

export default connect(
  state => ({
    searchResults: state.ChatReducer.chatSearchResults,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username
  }),
  {
    searchChat,
    clearSearchResults: clearChatSearchResults,
    enterChannelWithId,
    openNewChatTab
  }
)(ChatSearchBox);
