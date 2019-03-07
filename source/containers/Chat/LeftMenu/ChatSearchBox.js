import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchInput from 'components/Texts/SearchInput';
import { stringIsEmpty } from 'helpers/stringHelpers';
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
  const [searchText, setSearchText] = useState('');
  const timerRef = useRef(null);

  return (
    <div style={{ padding: '0 1rem', zIndex: 5 }}>
      <SearchInput
        placeholder="Search for channels / users"
        onChange={onChatSearch}
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
    </div>
  );

  function onChatSearch(text) {
    clearTimeout(timerRef.current);
    setSearchText(text);
    if (stringIsEmpty(text) || text.length < 2) {
      return clearSearchResults();
    }
    timerRef.current = setTimeout(() => searchChat(text), 300);
  }

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
