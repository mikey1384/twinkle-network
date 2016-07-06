import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TweenState from 'components/HigherOrder/TweenState';
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
import {
  getTouchEvents,
  getMouseEvents,
  handleClick } from './helpers/interfaceEvents';


class Carousel extends Component {
  static defaultProps = {
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

  static touchObject = {}

  constructor(props) {
    super()
    this.state = {
      tweenQueue: props.tweenQueue,
      currentSlide: props.slideIndex,
      dragging: false,
      frameWidth: 0,
      left: 0,
      slideCount: 0,
      slidesToScroll: props.slidesToScroll,
      slideWidth: 0,
      top: 0
    }
  }

  componentWillMount() {
    setInitialDimensions.call(this);
  }

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
  }

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
  }

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
  }

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
          {...getTouchEvents.call(this)}
          {...getMouseEvents.call(this)}
          onClick={handleClick.bind(this)}>
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
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    clickSafe: state.PlaylistReducer.clickSafe
  }),
  {clickSafeOn, clickSafeOff}
)(TweenState(Carousel))
