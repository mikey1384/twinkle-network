const types = {
  CLEAR_LOADED: 'CLEAR_LOADED',
  LOAD_FEATURED_SUBJECTS: 'LOAD_FEATURED_SUBJECTS'
};

for (let key in types) {
  types[key] = `${types[key]}_SUBJECT`;
}

export default types;
