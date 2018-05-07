export function scrollElementToCenter(element) {
  document.body.scrollTo(0, element.offsetTop - document.body.innerHeight / 2)
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
