const types = {
  CHAT_SUBJECT_CHANGE: 'CHAT_SUBJECT_CHANGE',
  CHECK_VERSION: 'CHECK_VERSION',
  CLEAR: 'CLEAR',
  LOAD: 'LOAD'
}

for (let key in types) {
  types[key] = `${types[key]}_NOTI`
}

export default types
