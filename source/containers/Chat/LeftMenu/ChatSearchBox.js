import React from 'react';
import { useSearch } from 'helpers/hooks';
import Loading from 'components/Loading';
import SearchInput from 'components/Texts/SearchInput';
import { useAppContext } from 'context';

export default function ChatSearchBox() {
  const {
    chat: {
      state: { chatSearchResults },
      actions: {
        onClearChatSearchResults,
        onEnterChannelWithId,
        onOpenNewChatTab,
        onSearchChat,
        onUpdateSelectedChannelId
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
        searchResults={chatSearchResults}
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
      onUpdateSelectedChannelId(item.channelId);
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
