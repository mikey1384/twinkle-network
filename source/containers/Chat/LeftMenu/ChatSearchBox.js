import React, { useState } from 'react';
import Loading from 'components/Loading';
import SearchInput from 'components/Texts/SearchInput';
import { useMyState, useSearch } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

export default function ChatSearchBox() {
  const {
    requestHelpers: { loadChatChannel, searchChat }
  } = useAppContext();
  const { userId, username } = useMyState();
  const {
    state: { chatSearchResults },
    actions: {
      onClearChatSearchResults,
      onEnterChannelWithId,
      onOpenNewChatTab,
      onSearchChat,
      onUpdateSelectedChannelId
    }
  } = useChatContext();
  const [searchText, setSearchText] = useState('');
  const { handleSearch, searching } = useSearch({
    onSearch: handleSearchChat,
    onClear: onClearChatSearchResults,
    onSetSearchText: setSearchText
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
