import React from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import SearchInput from 'components/Texts/SearchInput';
import { connect } from 'react-redux';
import {
  onSearchChat,
  updateSelectedChannelId
} from 'redux/actions/ChatActions';
import { useAppContext } from 'context';

ChatSearchBox.propTypes = {
  onSearchChat: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  updateSelectedChannelId: PropTypes.func.isRequired
};

function ChatSearchBox({
  onSearchChat,
  searchResults,
  updateSelectedChannelId
}) {
  const {
    chat: {
      actions: {
        onClearChatSearchResults,
        onEnterChannelWithId,
        onOpenNewChatTab
      }
    },
    user: {
      state: { userId, username }
    },
    requestHelpers: { loadChatChannel, searchChat }
  } = useAppContext();
  const { handleSearch, searching, searchText, setSearchText } = useSearch({
    onSearch: handleSearchChat,
    onClear: onClearChatSearchResults
  });

  return (
    <div style={{ padding: '0 1rem', zIndex: 5 }}>
      <SearchInput
        placeholder="Play chess or talk with..."
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
          onClearChatSearchResults();
        }}
        onSelect={onSelect}
      />
      {searching && <Loading style={{ height: '7rem' }} />}
    </div>
  );

  async function handleSearchChat(text) {
    const data = await searchChat(text);
    onSearchChat(data);
  }

  async function onSelect(item) {
    if (item.primary || !!item.channelId) {
      updateSelectedChannelId(item.channelId);
      const data = await loadChatChannel({
        channelId: item.channelId
      });
      onEnterChannelWithId({ data, showOnTop: true });
    } else {
      onOpenNewChatTab({
        user: { username, id: userId },
        recepient: { username: item.label, id: item.id }
      });
    }
    setSearchText('');
    onClearChatSearchResults();
  }
}

export default connect(
  state => ({
    searchResults: state.ChatReducer.chatSearchResults
  }),
  {
    onSearchChat,
    updateSelectedChannelId
  }
)(ChatSearchBox);
