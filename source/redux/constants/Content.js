const types = {
  CLEAR_SEARCH_RESULTS: 'CLEAR_SEARCH_RESULTS',
  SEARCH: 'SEARCH'
}

for (let key in types) {
  types[key] = `${types[key]}_CONTENT`
}

export default types
