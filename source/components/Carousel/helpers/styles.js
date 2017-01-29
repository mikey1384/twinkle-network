import React from 'react'
import {getTargetLeft} from './animations'

export function getListStyles() {
  var listWidth = this.state.slideWidth * React.Children.count(this.props.children)
  var spacingOffset = this.props.cellSpacing * React.Children.count(this.props.children)
  var transform = 'translate3d(' +
    this.getTweeningValue('left') + 'px, ' +
    this.getTweeningValue('top') + 'px, 0)'
  return {
    transform,
    WebkitTransform: transform,
    msTransform: 'translate(' +
      this.getTweeningValue('left') + 'px, ' +
      this.getTweeningValue('top') + 'px)',
    position: 'relative',
    display: 'block',
    margin: '0px ' + (this.props.cellSpacing / 2) * -1 + 'px',
    padding: 0,
    height: 'auto',
    width: listWidth + spacingOffset,
    cursor: this.state.dragging === true ? 'pointer' : 'inherit',
    boxSizing: 'border-box',
    MozBoxSizing: 'border-box'
  }
}

export function getFrameStyles() {
  return {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
    height: 'auto',
    margin: this.props.framePadding,
    padding: 0,
    transform: 'translate3d(0, 0, 0)',
    WebkitTransform: 'translate3d(0, 0, 0)',
    msTransform: 'translate(0, 0)',
    boxSizing: 'border-box',
    MozBoxSizing: 'border-box'
  }
}

export function getSliderStyles() {
  return {
    position: 'relative',
    display: 'block',
    width: this.props.width,
    height: 'auto',
    boxSizing: 'border-box',
    MozBoxSizing: 'border-box',
    visibility: this.state.slideWidth ? 'visible' : 'hidden'
  }
}

export function getSlideStyles() {
  return {
    display: 'inline-block',
    listStyleType: 'none',
    verticalAlign: 'top',
    width: this.state.slideWidth,
    height: 'auto',
    boxSizing: 'border-box',
    MozBoxSizing: 'border-box',
    marginLeft: this.props.cellSpacing / 2,
    marginRight: this.props.cellSpacing / 2,
    marginTop: 'auto',
    marginBottom: 'auto'
  }
}

export function getStyleTagStyles() {
  return '.slider-slide > img {width: 100%; display: block;}'
}

export function formatChildren(children) {
  var self = this
  return React.Children.map(children, function(child, index) {
    return <li className="slider-slide" style={getSlideStyles.call(self)} key={index}>{child}</li>
  })
}

export function setInitialDimensions() {
  var self = this
  var slideWidth

  slideWidth = this.props.initialSlideWidth || 0

  this.setState({
    frameWidth: '100%',
    slideCount: React.Children.count(this.props.children),
    slideWidth: slideWidth
  }, function() {
    setLeft.call(self)
    setExternalData.call(self)
  })
}

export function setDimensions() {
  var self = this
  var slideWidth
  var slidesToScroll
  var firstSlide
  var frame
  var frameWidth

  slidesToScroll = this.props.slidesToScroll
  frame = this.refs.frame
  firstSlide = frame.childNodes[0].childNodes[0]
  if (firstSlide) {
    firstSlide.style.height = 'auto'
  }

  if (typeof this.props.slideWidth !== 'number') {
    slideWidth = parseInt(this.props.slideWidth, 10)
  } else {
    slideWidth = (frame.offsetWidth / this.props.slidesToShow) * this.props.slideWidth
  }

  slideWidth -= this.props.cellSpacing * ((100 - (100 / this.props.slidesToShow)) / 100)

  frameWidth = frame.offsetWidth

  if (this.props.slidesToScroll === 'auto') {
    slidesToScroll = Math.floor(frameWidth / (slideWidth + this.props.cellSpacing))
  }

  this.setState({
    frameWidth: frameWidth,
    slideWidth: slideWidth,
    slidesToScroll: slidesToScroll,
    left: getTargetLeft.call(this),
    top: 0
  }, function() {
    setLeft.call(self)
  })
}

function setLeft() {
  this.setState({
    left: getTargetLeft.call(this),
    top: 0
  })
}

export function setExternalData() {
  if (this.props.data) {
    this.props.data()
  }
}
