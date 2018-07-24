const types = {
  CHANGE_INPUT: 'CHANGE_INPUT',
  CLOSE: 'CLOSE',
  INIT: 'INIT'
}

for (let key in types) {
  types[key] = `${types[key]}_SEARCH`
}

export default types
