const types = {
  CHANGE_PAGE_VISIBILITY: 'CHANGE_PAGE_VISIBILITY',
  HIDE_MOBILE_NAVBAR: 'HIDE_MOBILE_NAVBAR',
  SHOW_MOBILE_NAVBAR: 'SHOW_MOBILE_NAVBAR'
};

for (let key in types) {
  types[key] = `${types[key]}_VIEW`;
}

export default types;
