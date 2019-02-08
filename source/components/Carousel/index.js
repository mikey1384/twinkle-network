import React, { Component } from 'react';
import ExecutionEnvironment from 'exenv';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import NavButton from './NavButton';
import Button from 'components/Button';
import { connect } from 'react-redux';
import { clickSafeOn, clickSafeOff } from 'redux/actions/VideoActions';
import { css } from 'emotion';
import ProgressBar from 'components/ProgressBar';
import easingTypes from 'tween-functions';
import PropTypes from 'prop-types';
import requestAnimationFrame from 'raf';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';

const DEFAULT_STACK_BEHAVIOR = 'ADDITIVE';
const DEFAULT_EASING = easingTypes.easeInOutQuad;
const DEFAULT_DURATION = 300;
const DEFAULT_DELAY = 0;

const stackBehavior = {
  ADDITIVE: 'ADDITIVE',
  DESTRUCTIVE: 'DESTRUCTIVE'
};

class Carousel extends Component {
  static propTypes = {
    afterSlide: PropTypes.func,
    beforeSlide: PropTypes.func,
    cellAlign: PropTypes.string,
    chatMode: PropTypes.bool,
    children: PropTypes.array.isRequired,
    cellSpacing: PropTypes.number,
    className: PropTypes.string,
    clickSafe: PropTypes.bool,
    clickSafeOn: PropTypes.func,
    clickSafeOff: PropTypes.func,
    dragging: PropTypes.bool,
    easing: PropTypes.string,
    edgeEasing: PropTypes.string,
    framePadding: PropTypes.string,
    initialSlideWidth: PropTypes.number,
    onFinish: PropTypes.func,
    onShowAll: PropTypes.func,
    progressBar: PropTypes.bool,
    searchMode: PropTypes.bool,
    showAllButton: PropTypes.bool,
    showQuestionsBuilder: PropTypes.func,
    slideIndex: PropTypes.number.isRequired,
    slidesToScroll: PropTypes.number.isRequired,
    slidesToShow: PropTypes.number,
    slideWidth: PropTypes.number,
    speed: PropTypes.number,
    style: PropTypes.object,
    userCanEditThis: PropTypes.bool,
    userIsUploader: PropTypes.bool,
    width: PropTypes.string
  };

  static defaultProps = {
    afterSlide: function() {},
    beforeSlide: function() {},
    cellAlign: 'left',
    cellSpacing: 0,
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
  };

  static touchObject = {};
  static rafID = null;

  constructor(props) {
    super();
    this.state = {
      tweenQueue: [],
      currentSlide: props.slideIndex,
      dragging: false,
      frameWidth: 0,
      left: 0,
      slideCount: 0,
      slidesToScroll: props.slidesToScroll,
      slideWidth: 0,
      top: 0
    };
  }

  componentDidMount() {
    this.setInitialDimensions();
    this.setDimensions();
    bindListeners.call(this);

    function bindListeners() {
      if (ExecutionEnvironment.canUseDOM) {
        addEvent(window, 'resize', this.onResize);
        addEvent(document, 'readystatechange', this.onReadyStateChange);
      }
    }
  }

  componentDidUpdate(prevProps, slideIndex) {
    const { chatMode, searchMode } = this.props;
    if (prevProps.clickSafe !== this.props.clickSafe) return;
    if (prevProps.children.length !== this.props.children.length) {
      this.setState({
        slideCount: this.props.children.length
      });
    }
    if (
      !chatMode &&
      !searchMode &&
      (prevProps.chatMode !== chatMode || prevProps.searchMode !== searchMode)
    ) {
      setTimeout(this.setDimensions(), 0);
    }
  }

  componentWillUnmount() {
    unbindListeners.call(this);
    requestAnimationFrame.cancel(this.rafID);
    this.rafID = -1;

    function unbindListeners() {
      if (ExecutionEnvironment.canUseDOM) {
        removeEvent(window, 'resize', this.onResize);
        removeEvent(document, 'readystatechange', this.onReadyStateChange);
      }
    }
  }

  render() {
    const {
      className,
      showAllButton,
      showQuestionsBuilder,
      onShowAll,
      onFinish,
      progressBar,
      style,
      userIsUploader,
      userCanEditThis
    } = this.props;
    const { slidesToScroll, currentSlide, slideCount } = this.state;
    const slideFraction = (currentSlide + 1) / slideCount;
    return (
      <ErrorBoundary>
        <div
          className={`slider ${className} ${css`
            font-size: 1.5rem;
          `}`}
          ref={ref => {
            this.Slider = ref;
          }}
          style={{
            position: 'relative',
            display: 'block',
            width: this.props.width,
            height: 'auto',
            boxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            visibility: this.state.slideWidth ? 'visible' : 'hidden',
            ...style
          }}
        >
          {(userIsUploader || userCanEditThis) && (
            <a
              style={{
                position: 'absolute',
                cursor: 'pointer'
              }}
              onClick={showQuestionsBuilder}
            >
              Add/Edit Questions
            </a>
          )}
          {progressBar && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonGroup
                buttons={[
                  {
                    label: 'Prev',
                    onClick: this.previousSlide,
                    buttonClass: 'transparent',
                    disabled: currentSlide === 0
                  },
                  {
                    label: currentSlide + 1 === slideCount ? 'Finish' : 'Next',
                    onClick:
                      currentSlide + 1 === slideCount
                        ? onFinish
                        : this.nextSlide,
                    buttonClass:
                      currentSlide + 1 === slideCount
                        ? 'primary'
                        : 'transparent'
                  }
                ]}
              />
              <ProgressBar
                progress={slideFraction * 100}
                color={
                  currentSlide + 1 === slideCount
                    ? Color.blue()
                    : Color.logoBlue()
                }
                style={{ width: '100%' }}
                text={`${currentSlide + 1}/${slideCount}`}
              />
            </div>
          )}
          <div
            className="slider-frame"
            ref={ref => {
              this.Frame = ref;
            }}
            style={{
              position: 'relative',
              display: 'block',
              overflow: 'hidden',
              height: 'auto',
              margin: this.props.framePadding,
              padding: '5px',
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
              msTransform: 'translate(0, 0)',
              boxSizing: 'border-box',
              MozBoxSizing: 'border-box'
            }}
            onTouchStart={e => {
              this.touchObject = {
                startX: e.touches[0].pageX,
                startY: e.touches[0].pageY
              };
            }}
            onTouchMove={e => {
              var direction = this.swipeDirection(
                this.touchObject.startX,
                e.touches[0].pageX,
                this.touchObject.startY,
                e.touches[0].pageY
              );

              if (direction !== 0) {
                e.preventDefault();
              }

              var length = Math.round(
                Math.sqrt(
                  Math.pow(e.touches[0].pageX - this.touchObject.startX, 2)
                )
              );

              this.touchObject = {
                startX: this.touchObject.startX,
                startY: this.touchObject.startY,
                endX: e.touches[0].pageX,
                endY: e.touches[0].pageY,
                length: length,
                direction: direction
              };

              this.setState({
                left: this.getTargetLeft(
                  this.touchObject.length * this.touchObject.direction
                ),
                top: 0
              });
            }}
            onTouchEnd={this.handleSwipe}
            onTouchCancel={this.handleSwipe}
            onMouseDown={e => {
              if (!this.props.dragging) return;
              this.touchObject = {
                startX: e.clientX,
                startY: e.clientY
              };
              this.setState({
                dragging: true
              });
            }}
            onMouseMove={e => {
              if (!this.state.dragging) {
                return;
              }
              var direction = this.swipeDirection(
                this.touchObject.startX,
                e.clientX,
                this.touchObject.startY,
                e.clientY
              );

              if (direction !== 0) {
                e.preventDefault();
              }

              var length = Math.round(
                Math.sqrt(Math.pow(e.clientX - this.touchObject.startX, 2))
              );

              this.touchObject = {
                startX: this.touchObject.startX,
                startY: this.touchObject.startY,
                endX: e.clientX,
                endY: e.clientY,
                length: length,
                direction: direction
              };

              this.setState({
                left: this.getTargetLeft(
                  this.touchObject.length * this.touchObject.direction
                ),
                top: 0
              });
            }}
            onMouseUp={e => {
              if (!this.state.dragging) {
                return;
              }
              this.handleSwipe(e);
            }}
            onMouseLeave={e => {
              if (!this.state.dragging) {
                return;
              }

              this.handleSwipe(e);
            }}
            onClick={this.handleClick}
          >
            <ul
              className="slider-list"
              ref={ref => {
                this.List = ref;
              }}
              style={{
                transform: `translate3d(${this.getTweeningValue(
                  'left'
                )}px, ${this.getTweeningValue('top')}px, 0)`,
                position: 'relative',
                display: 'block',
                margin: '0px ' + (this.props.cellSpacing / 2) * -1 + 'px',
                padding: 0,
                height: 'auto',
                width:
                  this.state.slideWidth *
                    React.Children.count(this.props.children) +
                  this.props.cellSpacing *
                    React.Children.count(this.props.children),
                cursor: this.state.dragging === true ? 'pointer' : 'inherit',
                boxSizing: 'border-box'
              }}
            >
              {React.Children.count(this.props.children) > 1
                ? this.formatChildren({
                    children: this.props.children,
                    slideWidth: this.state.slideWidth,
                    cellSpacing: this.props.cellSpacing
                  })
                : this.props.children}
            </ul>
          </div>
          {!this.props.progressBar && [
            <NavButton
              left
              key={0}
              disabled={currentSlide === 0}
              nextSlide={this.previousSlide}
            />,
            <div key={1}>
              {slideCount > 5 &&
              currentSlide + slidesToScroll >= slideCount &&
              showAllButton ? (
                <Button
                  snow
                  style={{
                    position: 'absolute',
                    top: '7rem',
                    right: '-0.5rem',
                    opacity: 0.9
                  }}
                  onClick={onShowAll}
                >
                  Show All
                </Button>
              ) : (
                <NavButton
                  disabled={currentSlide + slidesToScroll >= slideCount}
                  nextSlide={this.nextSlide}
                />
              )}
            </div>
          ]}
        </div>
      </ErrorBoundary>
    );
  }

  animateSlide = (easing, duration, endValue) => {
    this.tweenState('left', {
      easing: easing || easingTypes[this.props.easing],
      duration: duration || this.props.speed,
      endValue: endValue || this.getTargetLeft()
    });
  };

  formatChildren = ({ children, slideWidth, cellSpacing }) =>
    React.Children.map(children, (child, index) => (
      <li
        className="slider-slide"
        style={{
          display: 'inline-block',
          listStyleType: 'none',
          verticalAlign: 'top',
          width: slideWidth,
          height: 'auto',
          boxSizing: 'border-box',
          MozBoxSizing: 'border-box',
          marginLeft: cellSpacing / 2 - 0.5,
          marginRight: cellSpacing / 2 - 0.5,
          marginTop: 'auto',
          marginBottom: 'auto'
        }}
        key={index}
      >
        {child}
      </li>
    ));

  getTargetLeft = touchOffset => {
    var offset;
    switch (this.props.cellAlign) {
      case 'left':
        offset = 0;
        offset -= this.props.cellSpacing * this.state.currentSlide;
        break;
      case 'center':
        offset = (this.state.frameWidth - this.state.slideWidth) / 2;
        offset -= this.props.cellSpacing * this.state.currentSlide;
        break;
      case 'right':
        offset = this.state.frameWidth - this.state.slideWidth;
        offset -= this.props.cellSpacing * this.state.currentSlide;
        break;
      default:
        break;
    }

    offset -= touchOffset || 0;

    return (this.state.slideWidth * this.state.currentSlide - offset) * -1;
  };

  handleClick = e => {
    if (this.props.clickSafe) {
      e.preventDefault();
      e.stopPropagation();

      if (e.nativeEvent) {
        e.nativeEvent.stopPropagation();
      }
    }
  };

  tweenState = (
    path,
    {
      easing,
      duration,
      delay,
      beginValue,
      endValue,
      onEnd,
      stackBehavior: configSB
    }
  ) => {
    this.setState(prevState => {
      let stateName;
      // see comment below on pash hash
      let pathHash;
      if (typeof path === 'string') {
        stateName = path;
        pathHash = path;
      }
      // see the reasoning for these defaults at the top of file
      const newConfig = {
        easing: easing || DEFAULT_EASING,
        duration: duration == null ? DEFAULT_DURATION : duration,
        delay: delay == null ? DEFAULT_DELAY : delay,
        beginValue: beginValue == null ? prevState[stateName] : beginValue,
        endValue: endValue,
        onEnd: onEnd,
        stackBehavior: configSB || DEFAULT_STACK_BEHAVIOR
      };

      let newTweenQueue = prevState.tweenQueue;
      if (newConfig.stackBehavior === stackBehavior.DESTRUCTIVE) {
        newTweenQueue = prevState.tweenQueue.filter(
          item => item.pathHash !== pathHash
        );
      }

      // we store path hash, so that during value retrieval we can use hash
      // comparison to find the path. See the kind of shitty thing you have to
      // do when you don't have value comparison for collections?
      newTweenQueue.push({
        pathHash: pathHash,
        config: newConfig,
        initTime: Date.now() + newConfig.delay
      });

      if (newTweenQueue.length === 1) {
        this.rafID = requestAnimationFrame(this.rafCb);
      }

      return {
        tweenQueue: newTweenQueue,
        [stateName]: newConfig.endValue
      };
    });
  };

  getTweeningValue = path => {
    const state = this.state;

    let tweeningValue;
    let pathHash;
    if (typeof path === 'string') {
      tweeningValue = state[path];
      pathHash = path;
    } else {
      tweeningValue = state;
      for (let i = 0; i < path.length; i++) {
        tweeningValue = tweeningValue[path[i]];
      }
      pathHash = path.join('|');
    }
    let now = Date.now();

    for (let i = 0; i < state.tweenQueue.length; i++) {
      const { pathHash: itemPathHash, initTime, config } = state.tweenQueue[i];
      if (itemPathHash !== pathHash) {
        continue;
      }

      const progressTime =
        now - initTime > config.duration
          ? config.duration
          : Math.max(0, now - initTime);
      // `now - initTime` can be negative if initTime is scheduled in the
      // future by a delay. In this case we take 0

      // if duration is 0, consider that as jumping to endValue directly. This
      // is needed because the easing function might have undefined behavior for
      // duration = 0
      const easeValue =
        config.duration === 0
          ? config.endValue
          : config.easing(
              progressTime,
              config.beginValue,
              config.endValue,
              config.duration
              // TODO: some funcs accept a 5th param
            );
      const contrib = easeValue - config.endValue;
      tweeningValue += contrib;
    }

    return tweeningValue;
  };

  goToSlide = index => {
    if (index >= React.Children.count(this.props.children) || index < 0) {
      return;
    }

    this.props.beforeSlide(this.state.currentSlide, index);

    this.setState(
      {
        currentSlide: index
      },
      function() {
        this.animateSlide();
        this.props.afterSlide(index);
      }
    );
  };

  handleSwipe = e => {
    if (
      typeof this.touchObject.length !== 'undefined' &&
      this.touchObject.length > 44
    ) {
      this.props.clickSafeOn();
    } else {
      this.props.clickSafeOff();
    }
    if (
      this.touchObject.length >
      this.state.slideWidth / this.props.slidesToShow / 5
    ) {
      if (this.touchObject.direction === 1) {
        if (
          this.state.currentSlide >=
          React.Children.count(this.props.children) - this.props.slidesToShow
        ) {
          this.animateSlide(easingTypes[this.props.edgeEasing]);
        } else {
          this.nextSlide();
        }
      } else if (this.touchObject.direction === -1) {
        if (this.state.currentSlide <= 0) {
          this.animateSlide(easingTypes[this.props.edgeEasing]);
        } else {
          this.previousSlide();
        }
      }
    } else {
      this.goToSlide(this.state.currentSlide);
    }

    this.touchObject = {};

    this.setState({
      dragging: false
    });
  };

  nextSlide = () => {
    var childrenCount = React.Children.count(this.props.children);
    if (this.state.currentSlide >= childrenCount - this.props.slidesToShow) {
      return;
    }

    this.goToSlide(
      Math.min(
        this.state.currentSlide + this.state.slidesToScroll,
        childrenCount - this.props.slidesToShow
      )
    );
  };

  previousSlide = () => {
    if (this.state.currentSlide <= 0) {
      return;
    }

    this.goToSlide(
      Math.max(0, this.state.currentSlide - this.state.slidesToScroll)
    );
  };

  rafCb = () => {
    const state = this.state;
    if (state.tweenQueue.length === 0) {
      return;
    }

    const now = Date.now();
    let newTweenQueue = [];

    for (let i = 0; i < state.tweenQueue.length; i++) {
      const item = state.tweenQueue[i];
      const { initTime, config } = item;
      if (now - initTime < config.duration) {
        newTweenQueue.push(item);
      } else {
        config.onEnd && config.onEnd();
      }
    }

    // onEnd might trigger a parent callback that removes this component
    // -1 means we've canceled it in componentWillUnmount
    if (this.rafID === -1) {
      return;
    }

    this.setState({
      tweenQueue: newTweenQueue
    });

    this.rafID = requestAnimationFrame(this.rafCb);
  };

  onResize = () => {
    if (!this.props.chatMode && !this.props.searchMode) {
      this.setDimensions();
    }
  };

  onReadyStateChange = () => {
    this.setDimensions();
  };

  setInitialDimensions = () => {
    var slideWidth;

    slideWidth = this.props.initialSlideWidth || 0;
    this.setState(
      {
        frameWidth: '100%',
        slideCount: React.Children.count(this.props.children),
        slideWidth: slideWidth
      },
      function() {
        this.setLeft();
      }
    );
  };

  setDimensions = () => {
    var slideWidth;
    var slidesToScroll;
    var firstSlide;
    var frame;
    var frameWidth;

    slidesToScroll = this.props.slidesToScroll;
    frame = this.Frame;
    firstSlide = frame.childNodes[0].childNodes[0];
    if (firstSlide) {
      firstSlide.style.height = 'auto';
    }

    if (typeof this.props.slideWidth !== 'number') {
      slideWidth = parseInt(this.props.slideWidth, 0);
    } else {
      slideWidth =
        (frame.offsetWidth / this.props.slidesToShow) * this.props.slideWidth;
    }

    slideWidth -=
      this.props.cellSpacing * ((100 - 100 / this.props.slidesToShow) / 100);
    frameWidth = frame.offsetWidth;

    if (this.props.slidesToScroll === 'auto') {
      slidesToScroll = Math.floor(
        frameWidth / (slideWidth + this.props.cellSpacing)
      );
    }
    this.setState(
      {
        frameWidth: frameWidth,
        slideWidth: slideWidth,
        slidesToScroll: slidesToScroll,
        left: this.getTargetLeft(),
        top: 0
      },
      function() {
        this.setLeft();
      }
    );
  };

  setLeft = () => {
    this.setState({
      left: this.getTargetLeft(),
      top: 0
    });
  };

  swipeDirection = (x1, x2, y1, y2) => {
    var xDist, yDist, r, swipeAngle;

    xDist = x1 - x2;
    yDist = y1 - y2;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round((r * 180) / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return 1;
    }
    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return 1;
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return -1;
    }
    return 0;
  };
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    searchMode: state.SearchReducer.searchMode,
    clickSafe: state.VideoReducer.clickSafe
  }),
  { clickSafeOn, clickSafeOff }
)(Carousel);
