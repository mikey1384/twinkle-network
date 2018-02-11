export function scrollElementToCenter(element) {
  document.body.scrollTo(0, element.offsetTop - document.body.innerHeight / 2)
}

export function textIsOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  )
}
