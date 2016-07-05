import React from 'react';

export function getListStyles() {
  var listWidth = this.state.slideWidth * React.Children.count(this.props.children);
  var spacingOffset = this.props.cellSpacing * React.Children.count(this.props.children);
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
