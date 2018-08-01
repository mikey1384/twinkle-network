const types = {
  CHANGE_FILTER: 'CHANGE_FILTER',
  CHANGE_INPUT: 'CHANGE_INPUT',
  CLOSE: 'CLOSE',
  INIT: 'INIT',
  RECORD_SCROLL_POSITION: 'RECORD_SCROLL_POSITION',
  SET_RESULTS: 'SET_RESULTS'
}

for (let key in types) {
  types[key] = `${types[key]}_SEARCH`
}

export default types
