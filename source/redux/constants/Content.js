const types = {
  SHOW_COMMENTS: 'SHOW_COMMENTS'
};

for (let key in types) {
  types[key] = `${types[key]}_CONTENT`;
}

export default types;
