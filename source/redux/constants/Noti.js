const types = {
  CHAT_SUBJECT_CHANGE: 'CHAT_SUBJECT_CHANGE',
  CHECK_VERSION: 'CHECK_VERSION',
  CLEAR: 'CLEAR',
  INCREASE_NUM_NEW_POSTS: 'INCREASE_NUM_NEW_POSTS',
  LOAD: 'LOAD',
  RESET_NUM_NEW_POSTS: 'RESET_NUM_NEW_POSTS'
}

for (let key in types) {
  types[key] = `${types[key]}_NOTI`
}

export default types
