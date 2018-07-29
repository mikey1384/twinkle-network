export function scrollElementToCenter(element) {
  if (!element) return
  let offsetTop = 0
  const body = document.scrollingElement || document.documentElement
  addAllOffsetTop(element)
  body.scrollTop = offsetTop - (body.clientHeight - element.clientHeight) / 2
  document.getElementById('App').scrollTop =
    offsetTop -
    (document.getElementById('App').clientHeight - element.clientHeight) / 2
  function addAllOffsetTop(element) {
    offsetTop += element.offsetTop
    if (element.offsetParent) {
      addAllOffsetTop(element.offsetParent)
    }
  }
}

export function textIsOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  )
}

export function determineXpButtonDisabled({
  stars,
  myId,
  xpRewardInterfaceShown
}) {
  if (xpRewardInterfaceShown) return 'Reward'
  const numTotalStars = stars.reduce(
    (prev, star) => prev + star.rewardAmount,
    0
  )
  if (numTotalStars >= 5) return '5/5 Stars'
  const numPrevStars = stars.reduce((prev, star) => {
    if (star.rewarderId === myId) {
      return prev + star.rewardAmount
    }
    return prev
  }, 0)
  if (numPrevStars >= 2) return '2/2 Rewarded'
  return false
}
