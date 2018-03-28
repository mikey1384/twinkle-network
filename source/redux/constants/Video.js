const types = {
  CLOSE_MODAL: 'CLOSE_MODAL',
  DELETE: 'DELETE',
  DELETE_COMMENT: 'DELETE_COMMENT',
  DELETE_DISCUSSION: 'DELETE_DISCUSSION',
  EDIT_COMMENT: 'EDIT_COMMENT',
  EDIT_DISCUSSION: 'EDIT_DISCUSSION',
  EDIT_PAGE: 'EDIT_PAGE',
  LOAD: 'LOAD'
}

for (let key in types) {
  types[key] = `${types[key]}_VIDEO`
}

export default types
