const types = {
  DELETE: 'DELETE',
  EDIT_PAGE: 'EDIT_PAGE',
  EDIT_TITLE: 'EDIT_TITLE',
  LIKE: 'LIKE',
  LOAD: 'LOAD',
  LOAD_MORE: 'LOAD_MORE',
  UPLOAD: 'UPLOAD'
};

for (let key in types) {
  types[key] = `${types[key]}_LINK`;
}

export default types;
