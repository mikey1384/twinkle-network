export const applyChangedChannelTitle = data => ({
  type: 'APPLY_CHANGED_CHANNEL_TITLE',
  data
})

export const createNewChannel = data => ({
  type: 'CREATE_NEW_CHANNEL',
  data
})

export const hideChat = channelId => ({
  type: 'HIDE_CHAT',
  channelId
})

export const inviteUsersToChannel = data => ({
  type: 'INVITE_USERS_TO_CHANNEL',
  data
})

export const leaveChannel = channelId => ({
  type: 'LEAVE_CHANNEL',
  channelId
})

export const loadMoreMessages = data => ({
  type: 'LOAD_MORE_MSG',
  data
})

export const openNewChatTab = (user, partner) => ({
  type: 'OPEN_NEW_CHAT_TAB',
  user,
  partner
})

export const searchUserToInvite = data => ({
  type: 'SEARCH_USERS_FOR_CHANNEL',
  data
})
