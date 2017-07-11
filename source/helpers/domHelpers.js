export function scrollElementToCenter(element) {
  window.scrollTo(0, element.offsetTop - window.innerHeight/2)
}

export function textIsOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
}
