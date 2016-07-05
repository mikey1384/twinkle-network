import React from 'react';
import {getSlideStyles} from './styles';

export function formatChildren(children) {
  var self = this;
  return React.Children.map(children, function(child, index) {
    return <li className="slider-slide" style={getSlideStyles.bind(self)()} key={index}>{child}</li>
  });
}

export function setInitialDimensions() {
  var self = this, slideWidth, frameHeight, slideHeight;

  slideWidth = this.props.initialSlideWidth || 0;
  slideHeight = this.props.initialSlideHeight ? this.props.initialSlideHeight * this.props.slidesToShow : 0;

  frameHeight = slideHeight + ((this.props.cellSpacing / 2) * (this.props.slidesToShow - 1));

  this.setState({
    frameWidth: '100%',
    slideCount: React.Children.count(this.props.children),
    slideWidth: slideWidth
  }, function() {
    setLeft.bind(self)();
    setExternalData.bind(self)();
  });
}

export function setDimensions() {
  var self = this,
    slideWidth,
    slidesToScroll,
    firstSlide,
    frame,
    frameWidth,
    frameHeight,
    slideHeight;

  slidesToScroll = this.props.slidesToScroll;
  frame = this.refs.frame;
  firstSlide = frame.childNodes[0].childNodes[0];
  if (firstSlide) {
    firstSlide.style.height = 'auto';
    slideHeight = firstSlide.offsetHeight * this.props.slidesToShow;
  } else {
    slideHeight = 100;
  }

  if (typeof this.props.slideWidth !== 'number') {
    slideWidth = parseInt(this.props.slideWidth);
  } else {
    slideWidth = (frame.offsetWidth / this.props.slidesToShow) * this.props.slideWidth;
  }

  slideWidth -= this.props.cellSpacing * ((100 - (100 / this.props.slidesToShow)) / 100);

  frameHeight = slideHeight + ((this.props.cellSpacing / 2) * (this.props.slidesToShow - 1));
  frameWidth = frame.offsetWidth;

  if (this.props.slidesToScroll === 'auto') {
    slidesToScroll = Math.floor(frameWidth / (slideWidth + this.props.cellSpacing));
  }

  this.setState({
    frameWidth: frameWidth,
    slideWidth: slideWidth,
    slidesToScroll: slidesToScroll,
    left: this.getTargetLeft(),
    top: 0
  }, function() {
    setLeft.bind(self)()
  });
}

function setLeft() {
  this.setState({
    left: this.getTargetLeft(),
    top: 0
  })
}

export function setExternalData() {
  if (this.props.data) {
    this.props.data();
  }
}
