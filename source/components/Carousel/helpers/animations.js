import easingTypes from 'tween-functions'

export function animateSlide(easing, duration, endValue) {
  this.tweenState('left', {
    easing: easing || easingTypes[this.props.easing],
    duration: duration || this.props.speed,
    endValue: endValue || getTargetLeft.call(this)
  })
}

export function getTargetLeft(touchOffset) {
  var offset
  switch (this.props.cellAlign) {
    case 'left':
      offset = 0
      offset -= this.props.cellSpacing * this.state.currentSlide
      break
    case 'center':
      offset = (this.state.frameWidth - this.state.slideWidth) / 2
      offset -= this.props.cellSpacing * this.state.currentSlide
      break
    case 'right':
      offset = this.state.frameWidth - this.state.slideWidth
      offset -= this.props.cellSpacing * this.state.currentSlide
      break
    default:
      break
  }

  offset -= touchOffset || 0

  return (this.state.slideWidth * this.state.currentSlide - offset) * -1
}
