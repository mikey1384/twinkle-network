const types = {
  LOAD_FEATURED_CHALLENGES: 'LOAD_FEATURED_CHALLENGES'
};

for (let key in types) {
  types[key] = `${types[key]}_CHALLENGE`;
}

export default types;
