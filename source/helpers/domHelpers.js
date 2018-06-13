export function scrollElementToCenter(element) {
  if (!element) return
  let offsetTop = 0
  addAllOffsetTop(element)
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
  if (xpRewardInterfaceShown) return 'Reward Stars'
  const numTotalStars = stars.reduce(
    (prev, star) => prev + star.rewardAmount,
    0
  )
  if (numTotalStars >= 5) return 'Max Stars Reached'
  const numPrevStars = stars.reduce((prev, star) => {
    if (star.rewarderId === myId) {
      return prev + star.rewardAmount
    }
    return prev
  }, 0)
  if (numPrevStars >= 2) return 'You rewarded 2 out of 2 Stars'
  return false
}
