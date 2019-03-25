const types = {
  CHANGE_PAGE_VISIBILITY: 'CHANGE_PAGE_VISIBILITY'
};

for (let key in types) {
  types[key] = `${types[key]}_VIEW`;
}

export default types;
