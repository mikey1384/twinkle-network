const types = {
  CHANGE_PAGE_VISIBILITY: 'CHANGE_PAGE_VISIBILITY',
  RECORD_SCROLL_POSITION: 'RECORD_SCROLL_POSITION'
};

for (let key in types) {
  types[key] = `${types[key]}_VIEW`;
}

export default types;
