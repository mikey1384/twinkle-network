import React from 'react'
import {animateSlide} from './animations'
import {setExternalData} from './styles'

export function goToSlide(index) {
  if (index >= React.Children.count(this.props.children) || index < 0) {
    return
  }

  this.props.beforeSlide(this.state.currentSlide, index)

  this.setState({
    currentSlide: index
  }, function() {
    animateSlide.call(this)
    this.props.afterSlide(index)
    setExternalData.call(this)
  })
}

export function nextSlide() {
  var childrenCount = React.Children.count(this.props.children)
  if (this.state.currentSlide >= childrenCount - this.props.slidesToShow) {
    return
  }

  goToSlide.call(this, Math.min(this.state.currentSlide + this.state.slidesToScroll, childrenCount - this.props.slidesToShow))
}

export function previousSlide() {
  if (this.state.currentSlide <= 0) {
    return
  }

  goToSlide.call(this, Math.max(0, this.state.currentSlide - this.state.slidesToScroll))
}
