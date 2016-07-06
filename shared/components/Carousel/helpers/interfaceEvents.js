import React from 'react';
import {getTargetLeft, animateSlide} from './animations';
import {goToSlide, nextSlide, previousSlide} from './actions';
import easingTypes from 'tween-functions';

export function getTouchEvents() {
  var self = this;

  if (this.props.dragging === false) {
    return null;
  }

  return {
    onTouchStart(e) {
      self.touchObject = {
        startX: e.touches[0].pageX,
        startY: e.touches[0].pageY
      }
    },
    onTouchMove(e) {
      var direction = swipeDirection.call(self,
        self.touchObject.startX,
        e.touches[0].pageX,
        self.touchObject.startY,
        e.touches[0].pageY
      );

      if (direction !== 0) {
        e.preventDefault();
      }

      var length = Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - self.touchObject.startX, 2)))

      self.touchObject = {
        startX: self.touchObject.startX,
        startY: self.touchObject.startY,
        endX: e.touches[0].pageX,
        endY: e.touches[0].pageY,
        length: length,
        direction: direction
      }

      self.setState({
        left: getTargetLeft.call(self, self.touchObject.length * self.touchObject.direction),
        top: 0
      });
    },
    onTouchEnd(e) {
      handleSwipe.call(self, e);
    },
    onTouchCancel(e) {
      handleSwipe.call(self, e);
    }
  }
}

export function getMouseEvents() {
  var self = this;

  if (this.props.dragging === false) {
    return null;
  }

  return {
    onMouseDown(e) {
      self.touchObject = {
        startX: e.clientX,
        startY: e.clientY
      };

      self.setState({
        dragging: true
      });
    },
    onMouseMove(e) {
      if (!self.state.dragging) {
        return;
      }

      var direction = swipeDirection.call(self,
        self.touchObject.startX,
        e.clientX,
        self.touchObject.startY,
        e.clientY
      );

      if (direction !== 0) {
        e.preventDefault();
      }

      var length = Math.round(Math.sqrt(Math.pow(e.clientX - self.touchObject.startX, 2)))

      self.touchObject = {
        startX: self.touchObject.startX,
        startY: self.touchObject.startY,
        endX: e.clientX,
        endY: e.clientY,
        length: length,
        direction: direction
      };

      self.setState({
        left: getTargetLeft.call(self, self.touchObject.length * self.touchObject.direction),
        top: 0
      });
    },
    onMouseUp(e) {
      if (!self.state.dragging) {
        return;
      }

      handleSwipe.call(self, e);
    },
    onMouseLeave(e) {
      if (!self.state.dragging) {
        return;
      }

      handleSwipe.call(self, e);
    }
  }
}

export function handleClick(e) {
  if (this.props.clickSafe) {
    e.preventDefault();
    e.stopPropagation();

    if (e.nativeEvent) {
      e.nativeEvent.stopPropagation();
    }
  }
}

function handleSwipe(e) {
  if (typeof this.touchObject.length !== 'undefined' && this.touchObject.length > 44) {
    this.props.clickSafeOn();
  } else {
    this.props.clickSafeOff();
  }

  if (this.touchObject.length > (this.state.slideWidth / this.props.slidesToShow) / 5) {
    if (this.touchObject.direction === 1) {
      if (this.state.currentSlide >= React.Children.count(this.props.children) - this.props.slidesToShow) {
        animateSlide.call(this, easingTypes[this.props.edgeEasing]);
      } else {
        nextSlide.call(this);
      }
    } else if (this.touchObject.direction === -1) {
      if (this.state.currentSlide <= 0) {
        animateSlide.call(this, easingTypes[this.props.edgeEasing]);
      } else {
        previousSlide.call(this);
      }
    }
  } else {
    goToSlide.call(this, this.state.currentSlide);
  }

  this.touchObject = {};

  this.setState({
    dragging: false
  });
}

function swipeDirection(x1, x2, y1, y2) {
  var xDist, yDist, r, swipeAngle;

  xDist = x1 - x2;
  yDist = y1 - y2;
  r = Math.atan2(yDist, xDist);

  swipeAngle = Math.round(r * 180 / Math.PI);
  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
  if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
    return 1;
  }
  if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
    return 1;
  }
  if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
    return -1;
  }
  return 0;
}
