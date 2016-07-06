import React from 'react';
import ReactDOM from 'react-dom';
import tweenState from './tweenState';
import assign from 'object-assign';
import ExecutionEnvironment from 'exenv';
import ButtonGroup from 'components/ButtonGroup';
import NavButton from './NavButton';
import {connect} from 'react-redux';
import {clickSafeOn, clickSafeOff} from 'redux/actions/PlaylistActions';
import {
  getListStyles,
  getFrameStyles,
  getSliderStyles,
  getSlideStyles,
  getStyleTagStyles,
  formatChildren,
  setInitialDimensions,
  setDimensions,
  setExternalData } from './helpers/styles';
import {onResize, onReadyStateChange} from './helpers/listeners';
import {animateSlide, getTargetLeft} from './helpers/animations';
import {
  goToSlide,
  nextSlide,
  previousSlide } from './helpers/actions';

const Carousel = React.createClass({
  mixins: [tweenState.Mixin],

  getDefaultProps() {
    return {
      afterSlide: function() { },
      beforeSlide: function() { },
      cellAlign: 'left',
      cellSpacing: 0,
      data: function() {},
      dragging: true,
      easing: 'easeOutCirc',
      edgeEasing: 'easeOutElastic',
      framePadding: '0px',
      slideIndex: 0,
      slidesToScroll: 1,
      slidesToShow: 1,
      slideWidth: 1,
      speed: 500,
      width: '100%'
    }
  },

  getInitialState() {
    return {
      currentSlide: this.props.slideIndex,
      dragging: false,
      frameWidth: 0,
      left: 0,
      slideCount: 0,
      slidesToScroll: this.props.slidesToScroll,
      slideWidth: 0,
      top: 0
    }
  },

  componentWillMount() {
    setInitialDimensions.call(this);
  },

  componentDidMount() {
    setDimensions.call(this);
    bindListeners.call(this);
    setExternalData.call(this);

    function bindListeners() {
      var self = this;
      if (ExecutionEnvironment.canUseDOM) {
        addEvent(window, 'resize', onResize.bind(this));
        addEvent(document, 'readystatechange', onReadyStateChange.bind(this));
      }

      function addEvent(elem, type, eventHandle) {
        if (elem === null || typeof elem === 'undefined') {
          return;
        }
        if (elem.addEventListener) {
          elem.addEventListener(type, eventHandle, false);
        } else if (elem.attachEvent) {
          elem.attachEvent('on' + type, eventHandle);
        } else {
          elem['on' + type] = eventHandle;
        }
      }
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      slideCount: nextProps.children.length
    });

    if(nextProps.chatMode === this.props.chatMode) {
      setDimensions.call(this);
    }

    if (nextProps.slideIndex !== this.state.currentSlide) {
      goToSlide.call(this, nextProps.slideIndex);
    }
  },

  componentWillUnmount() {
    unbindListeners.call(this);

    function unbindListeners() {
      var self = this;
      if (ExecutionEnvironment.canUseDOM) {
        removeEvent(window, 'resize', onResize);
        removeEvent(document, 'readystatechange', onReadyStateChange);
      }

      function removeEvent(elem, type, eventHandle) {
        if (elem === null || typeof (elem) === 'undefined') {
          return;
        }
        if (elem.removeEventListener) {
          elem.removeEventListener(type, eventHandle, false);
        } else if (elem.detachEvent) {
          elem.detachEvent('on' + type, eventHandle);
        } else {
          elem['on' + type] = null;
        }
      };
    }
  },

  render() {
    var self = this;
    var children = React.Children.count(this.props.children) > 1 ? formatChildren.call(this, this.props.children) : this.props.children;
    const slideFraction = (this.state.currentSlide + 1)/this.state.slideCount;
    return (
      <div className={['slider', this.props.className || ''].join(' ')} ref="slider" style={assign(getSliderStyles.call(this), this.props.style || {})}>
        { this.props.userIsUploader &&
          <a
            style={{
              position: 'absolute',
              cursor: 'pointer'
            }}
            onClick={() => this.props.showQuestionsBuilder()}
          >Add/Edit Questions</a>
        }
        {this.props.progressBar &&
          <div>
            <div
              className="text-center"
            >
              <ButtonGroup
                buttons={[
                  {
                    label: 'Prev',
                    onClick: previousSlide.bind(this),
                    buttonClass: 'btn-default',
                    disabled: this.state.currentSlide === 0
                  },
                  {
                    label: this.state.currentSlide + 1 === this.state.slideCount ? 'Finish' : 'Next',
                    onClick: this.state.currentSlide + 1 === this.state.slideCount ? this.props.onFinish : nextSlide.bind(this),
                    buttonClass: 'btn-default',
                  }
                ]}
              />
            </div>
            <div
              className="progress"
              style={{marginTop: '2rem'}}
            >
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{width: `${slideFraction*100}%`}}
              >{`${this.state.currentSlide + 1}/${this.state.slideCount}`}</div>
            </div>
          </div>
        }
        <div className="slider-frame"
          ref="frame"
          style={getFrameStyles.call(this)}
          {...this.getTouchEvents()}
          {...this.getMouseEvents()}
          onClick={this.handleClick}>
          <ul className="slider-list" ref="list" style={getListStyles.call(this)}>
            {children}
          </ul>
        </div>
        {!this.props.progressBar &&
          [
            <NavButton
              left
              key={0}
              disabled={self.state.currentSlide === 0}
              nextSlide={previousSlide.bind(self)}
            />,
            <NavButton
              key={1}
              disabled={this.state.currentSlide + this.state.slidesToScroll >= this.state.slideCount}
              nextSlide={nextSlide.bind(self)}
            />
          ]
        }
        <style type="text/css" dangerouslySetInnerHTML={{__html: getStyleTagStyles.call(self)}}/>
      </div>
    )
  },

  // Touch Events

  touchObject: {},

  getTouchEvents() {
    var self = this;

    return {
      onTouchStart(e) {
        self.touchObject = {
          startX: e.touches[0].pageX,
          startY: e.touches[0].pageY
        }
      },
      onTouchMove(e) {
        var direction = self.swipeDirection(
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
        self.handleSwipe(e);
      },
      onTouchCancel(e) {
        self.handleSwipe(e);
      }
    }
  },

  getMouseEvents() {
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

        var direction = self.swipeDirection(
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

        self.handleSwipe(e);
      },
      onMouseLeave(e) {
        if (!self.state.dragging) {
          return;
        }

        self.handleSwipe(e);
      }
    }
  },

  handleClick(e) {
    if (this.props.clickSafe) {
      e.preventDefault();
      e.stopPropagation();

      if (e.nativeEvent) {
        e.nativeEvent.stopPropagation();
      }
    }
  },

  handleSwipe(e) {
    if (typeof (this.touchObject.length) !== 'undefined' && this.touchObject.length > 44) {
      this.props.clickSafeOn();
    } else {
      this.props.clickSafeOff();
    }

    if (this.touchObject.length > (this.state.slideWidth / this.props.slidesToShow) / 5) {
      if (this.touchObject.direction === 1) {
        if (this.state.currentSlide >= React.Children.count(this.props.children) - this.props.slidesToShow) {
          animateSlide.call(this, tweenState.easingTypes[this.props.edgeEasing]);
        } else {
          nextSlide.call(this);
        }
      } else if (this.touchObject.direction === -1) {
        if (this.state.currentSlide <= 0) {
          animateSlide.call(this, tweenState.easingTypes[this.props.edgeEasing]);
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
  },

  swipeDirection(x1, x2, y1, y2) {

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
});

Carousel.ControllerMixin = {
  getInitialState() {
    return {
      carousels: {}
    }
  },
  setCarouselData(carousel) {
    var data = this.state.carousels;
    data[carousel] = this.refs[carousel];
    this.setState({
      carousels: data
    });
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    clickSafe: state.PlaylistReducer.clickSafe
  }),
  {clickSafeOn, clickSafeOff}
)(Carousel)
