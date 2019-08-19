const types = {
  CHANGE_INPUT: 'CHANGE_INPUT',
  LOAD_MORE_RESULTS: 'LOAD_MORE_RESULTS',
  SET_RESULTS: 'SET_RESULTS'
};

for (let key in types) {
  types[key] = `${types[key]}_SEARCH`;
}

export default types;
