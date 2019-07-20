import React from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import SearchInput from 'components/Texts/SearchInput';
import { connect } from 'react-redux';
import { loadChatChannel } from 'helpers/requestHelpers';
import {
  searchChat,
  clearChatSearchResults,
  enterChannelWithId,
  openNewChatTab,
  updateSelectedChannelId
} from 'redux/actions/ChatActions';

ChatSearchBox.propTypes = {
  clearSearchResults: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  enterChannelWithId: PropTypes.func.isRequired,
  openNewChatTab: PropTypes.func.isRequired,
  searchChat: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  updateSelectedChannelId: PropTypes.func.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string
};

function ChatSearchBox({
  clearSearchResults,
  dispatch,
  enterChannelWithId,
  openNewChatTab,
  searchChat,
  searchResults,
  updateSelectedChannelId,
  userId,
  username
}) {
  const { handleSearch, searching, searchText, setSearchText } = useSearch({
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
      {searching && <Loading style={{ height: '7rem' }} />}
    </div>
  );

  async function onSelect(item) {
    if (item.primary || !!item.channelId) {
      updateSelectedChannelId(item.channelId);
      const data = await loadChatChannel({
        channelId: item.channelId,
        dispatch
      });
      enterChannelWithId({ data, showOnTop: true });
    } else {
      openNewChatTab({
        user: { username, id: userId },
        partner: { username: item.label, id: item.id }
      });
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
  dispatch => ({
    dispatch,
    searchChat: params => dispatch(searchChat(params)),
    clearSearchResults: params => dispatch(clearChatSearchResults(params)),
    enterChannelWithId: params => dispatch(enterChannelWithId(params)),
    openNewChatTab: params => dispatch(openNewChatTab(params)),
    updateSelectedChannelId: channelId =>
      dispatch(updateSelectedChannelId(channelId))
  })
)(ChatSearchBox);
