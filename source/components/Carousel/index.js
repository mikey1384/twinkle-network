import React, { Component } from 'react'
import ExecutionEnvironment from 'exenv'
import ButtonGroup from 'components/ButtonGroup'
import NavButton from './NavButton'
import Button from 'components/Button'
import { connect } from 'react-redux'
import { clickSafeOn, clickSafeOff } from 'redux/actions/PlaylistActions'
import {
  getListStyles,
  getFrameStyles,
  getSliderStyles,
  getStyleTagStyles,
  formatChildren,
  setInitialDimensions,
  setDimensions,
  setExternalData
} from './helpers/styles'
import { goToSlide, nextSlide, previousSlide } from './helpers/actions'
import {
  getTouchEvents,
  getMouseEvents,
  handleClick
} from './helpers/interfaceEvents'
import { css } from 'emotion'
import ProgressBar from 'components/ProgressBar'
import { easeInOutQuad } from 'tween-functions'
import PropTypes from 'prop-types'
import requestAnimationFrame from 'raf'
import { Color } from 'constants/css'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'

const DEFAULT_STACK_BEHAVIOR = 'ADDITIVE'
const DEFAULT_EASING = easeInOutQuad
const DEFAULT_DURATION = 300
const DEFAULT_DELAY = 0

const stackBehavior = {
  ADDITIVE: 'ADDITIVE',
  DESTRUCTIVE: 'DESTRUCTIVE'
}

class Carousel extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    children: PropTypes.array.isRequired,
    className: PropTypes.string,
    clickSafe: PropTypes.bool,
    onFinish: PropTypes.func,
    onShowAll: PropTypes.func,
    progressBar: PropTypes.bool,
    showAllButton: PropTypes.bool,
    showQuestionsBuilder: PropTypes.func,
    slideIndex: PropTypes.number.isRequired,
    slidesToScroll: PropTypes.number.isRequired,
    style: PropTypes.object,
    userIsUploader: PropTypes.bool
  }

  static defaultProps = {
    afterSlide: function() {},
    beforeSlide: function() {},
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

  static touchObject = {}
  static rafID = null

  constructor(props) {
    super()
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
    }
    this.rafCb = this.rafCb.bind(this)
    this.getTweeningValue = this.getTweeningValue.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onReadyStateChange = this.onReadyStateChange.bind(this)
  }

  componentWillMount() {
    setInitialDimensions.call(this)
  }

  componentDidMount() {
    setDimensions.call(this)
    bindListeners.call(this)
    setExternalData.call(this)

    function bindListeners() {
      if (ExecutionEnvironment.canUseDOM) {
        addEvent(window, 'resize', this.onResize)
        addEvent(document, 'readystatechange', this.onReadyStateChange)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.clickSafe !== nextProps.clickSafe) return
    this.setState({
      slideCount: nextProps.children.length
    })

    if (nextProps.slideIndex !== this.state.currentSlide) {
      goToSlide.call(this, nextProps.slideIndex)
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.chatMode && prevProps.chatMode !== this.props.chatMode) {
      setTimeout(setDimensions.bind(this), 0)
    }
  }

  componentWillUnmount() {
    unbindListeners.call(this)
    requestAnimationFrame.cancel(this.rafID)
    this.rafID = -1

    function unbindListeners() {
      if (ExecutionEnvironment.canUseDOM) {
        removeEvent(window, 'resize', this.onResize)
        removeEvent(document, 'readystatechange', this.onReadyStateChange)
      }
    }
  }

  render() {
    var children =
      React.Children.count(this.props.children) > 1
        ? formatChildren.call(this, this.props.children)
        : this.props.children
    const {
      className,
      showAllButton,
      showQuestionsBuilder,
      onShowAll,
      onFinish,
      progressBar,
      style
    } = this.props
    const { slidesToScroll, currentSlide, slideCount } = this.state
    const slideFraction = (currentSlide + 1) / slideCount
    return (
      <div
        className={`slider ${className} ${css`
          font-size: 1.5rem;
        `}`}
        ref={ref => {
          this.Slider = ref
        }}
        style={{ ...getSliderStyles.call(this), ...style }}
      >
        {this.props.userIsUploader && (
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
                  onClick: previousSlide.bind(this),
                  buttonClass: 'transparent',
                  disabled: currentSlide === 0
                },
                {
                  label: currentSlide + 1 === slideCount ? 'Finish' : 'Next',
                  onClick:
                    currentSlide + 1 === slideCount
                      ? onFinish
                      : nextSlide.bind(this),
                  buttonClass: currentSlide + 1 === slideCount ? 'primary' : 'transparent'
                }
              ]}
            />
            <ProgressBar
              progress={slideFraction * 100}
              color={currentSlide + 1 === slideCount ? Color.blue() : Color.logoBlue()}
              style={{ width: '100%' }}
              text={`${currentSlide + 1}/${slideCount}`}
            />
          </div>
        )}
        <div
          className="slider-frame"
          ref={ref => {
            this.Frame = ref
          }}
          style={getFrameStyles.call(this)}
          {...getTouchEvents.call(this)}
          {...getMouseEvents.call(this)}
          onClick={handleClick.bind(this)}
        >
          <ul
            className="slider-list"
            ref={ref => {
              this.List = ref
            }}
            style={getListStyles.call(this)}
          >
            {children}
          </ul>
        </div>
        {!this.props.progressBar && [
          <NavButton
            left
            key={0}
            disabled={currentSlide === 0}
            nextSlide={previousSlide.bind(this)}
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
                  right: '-0.5rem'
                }}
                onClick={onShowAll}
              >
                Show All
              </Button>
            ) : (
              <NavButton
                disabled={currentSlide + slidesToScroll >= slideCount}
                nextSlide={nextSlide.bind(this)}
              />
            )}
          </div>
        ]}
        <style
          type="text/css"
          dangerouslySetInnerHTML={{ __html: getStyleTagStyles.call(this) }}
        />
      </div>
    )
  }

  tweenState(
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
  ) {
    this.setState(prevState => {
      let stateName
      // see comment below on pash hash
      let pathHash
      if (typeof path === 'string') {
        stateName = path
        pathHash = path
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
      }

      let newTweenQueue = prevState.tweenQueue
      if (newConfig.stackBehavior === stackBehavior.DESTRUCTIVE) {
        newTweenQueue = prevState.tweenQueue.filter(
          item => item.pathHash !== pathHash
        )
      }

      // we store path hash, so that during value retrieval we can use hash
      // comparison to find the path. See the kind of shitty thing you have to
      // do when you don't have value comparison for collections?
      newTweenQueue.push({
        pathHash: pathHash,
        config: newConfig,
        initTime: Date.now() + newConfig.delay
      })

      if (newTweenQueue.length === 1) {
        this.rafID = requestAnimationFrame(this.rafCb)
      }

      return {
        tweenQueue: newTweenQueue,
        [stateName]: newConfig.endValue
      }
    })
  }

  getTweeningValue(path) {
    const state = this.state

    let tweeningValue
    let pathHash
    if (typeof path === 'string') {
      tweeningValue = state[path]
      pathHash = path
    } else {
      tweeningValue = state
      for (let i = 0; i < path.length; i++) {
        tweeningValue = tweeningValue[path[i]]
      }
      pathHash = path.join('|')
    }
    let now = Date.now()

    for (let i = 0; i < state.tweenQueue.length; i++) {
      const { pathHash: itemPathHash, initTime, config } = state.tweenQueue[i]
      if (itemPathHash !== pathHash) {
        continue
      }

      const progressTime =
        now - initTime > config.duration
          ? config.duration
          : Math.max(0, now - initTime)
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
            )
      const contrib = easeValue - config.endValue
      tweeningValue += contrib
    }

    return tweeningValue
  }

  rafCb() {
    const state = this.state
    if (state.tweenQueue.length === 0) {
      return
    }

    const now = Date.now()
    let newTweenQueue = []

    for (let i = 0; i < state.tweenQueue.length; i++) {
      const item = state.tweenQueue[i]
      const { initTime, config } = item
      if (now - initTime < config.duration) {
        newTweenQueue.push(item)
      } else {
        config.onEnd && config.onEnd()
      }
    }

    // onEnd might trigger a parent callback that removes this component
    // -1 means we've canceled it in componentWillUnmount
    if (this.rafID === -1) {
      return
    }

    this.setState({
      tweenQueue: newTweenQueue
    })

    this.rafID = requestAnimationFrame(this.rafCb)
  }

  onResize() {
    if (!this.props.chatMode) {
      setDimensions.call(this)
    }
  }

  onReadyStateChange() {
    setDimensions.call(this)
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    clickSafe: state.PlaylistReducer.clickSafe
  }),
  { clickSafeOn, clickSafeOff }
)(Carousel)
