const types = {
  CHANGE_INPUT: 'CHANGE_INPUT'
}

for (let key in types) {
  types[key] = `${types[key]}_SEARCH`
}

export default types
