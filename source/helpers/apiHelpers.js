export function queryStringForArray(array, originVar, destinationVar) {
  return `${array
    .map(elem => `${destinationVar}[]=${elem[originVar]}`)
    .join('&')}`
}
