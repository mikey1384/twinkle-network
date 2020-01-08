import React, { useEffect, useRef, useState } from 'react';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import NavButton from './NavButton';
import Button from 'components/Button';
import ProgressBar from 'components/ProgressBar';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import * as d3Ease from 'd3-ease';
import { Animate } from 'react-move';
import { Color } from 'constants/css';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { useExploreContext } from 'contexts';

Carousel.propTypes = {
  afterSlide: PropTypes.func,
  allowDrag: PropTypes.bool,
  beforeSlide: PropTypes.func,
  children: PropTypes.array.isRequired,
  cellSpacing: PropTypes.number,
  className: PropTypes.string,
  framePadding: PropTypes.string,
  onFinish: PropTypes.func,
  onShowAll: PropTypes.func,
  progressBar: PropTypes.bool,
  showAllButton: PropTypes.bool,
  showQuestionsBuilder: PropTypes.func,
  slideIndex: PropTypes.number,
  slidesToScroll: PropTypes.number.isRequired,
  slidesToShow: PropTypes.number,
  slideWidthMultiplier: PropTypes.number,
  style: PropTypes.object,
  userCanEditThis: PropTypes.bool,
  userIsUploader: PropTypes.bool
};

export default function Carousel({
  allowDrag = true,
  afterSlide = () => {},
  beforeSlide = () => {},
  className,
  cellSpacing = 0,
  children,
  framePadding = '0px',
  onFinish,
  onShowAll,
  progressBar,
  slideIndex = 0,
  slidesToScroll = 1,
  slidesToShow = 1,
  slideWidthMultiplier = 1,
  showAllButton,
  showQuestionsBuilder,
  style,
  userCanEditThis,
  userIsUploader
}) {
  const {
    state: {
      videos: { clickSafe }
    },
    actions: { onClickSafeOff, onClickSafeOn }
  } = useExploreContext();
  const DEFAULT_DURATION = 300;
  const DEFAULT_EASING = 'easeCircleOut';
  const DEFAULT_EDGE_EASING = 'easeElasticOut';
  const [left, setLeft] = useState(0);
  const [easing, setEasing] = useState(DEFAULT_EASING);
  const [currentSlide, setCurrentSlide] = useState();
  const [dragging, setDragging] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideCount, setSlideCount] = useState(React.Children.count(children));
  const [touchObject, setTouchObject] = useState({});
  const FrameRef = useRef(null);
  const scrollYRef = useRef(null);

  useEffect(() => {
    setCurrentSlide(slideIndex);
  }, [slideIndex]);

  useEffect(() => {
    addEvent(window, 'resize', onResize);
    addEvent(document, 'readystatechange', onReadyStateChange);
    renderDimensions(FrameRef);
    return function cleanUp() {
      removeEvent(window, 'resize', onResize);
      removeEvent(document, 'readystatechange', onReadyStateChange);
    };
  });

  useEffect(() => {
    setSlideCount(React.Children.count(children));
  }, [children]);

  return (
    <ErrorBoundary>
      <div
        className={className}
        style={{
          position: 'relative',
          display: 'block',
          fontSize: '1.5rem',
          width: '100%',
          height: 'auto',
          boxSizing: 'border-box',
          visibility: slideWidth ? 'visible' : 'hidden',
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
                  onClick: previousSlide,
                  transparent: true,
                  disabled: currentSlide === 0
                },
                {
                  label: currentSlide + 1 === slideCount ? 'Finish' : 'Next',
                  onClick:
                    currentSlide + 1 === slideCount ? onFinish : nextSlide,
                  color: currentSlide + 1 === slideCount ? 'blue' : 'black',
                  transparent: currentSlide + 1 !== slideCount
                }
              ]}
            />
            <ProgressBar
              progress={((currentSlide + 1) / slideCount) * 100}
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
          ref={FrameRef}
          style={{
            position: 'relative',
            display: 'block',
            overflowX: 'hidden',
            height: 'auto',
            margin: framePadding,
            padding: '6px',
            transform: 'translate3d(0, 0, 0)',
            boxSizing: 'border-box'
          }}
          onTouchStart={e => {
            setTouchObject({
              startX: e.touches[0].pageX,
              startY: e.touches[0].pageY
            });
          }}
          onTouchMove={e => {
            if (!scrollYRef.current) {
              scrollYRef.current = (
                document.scrollingElement || document.documentElement
              ).scrollTop;
            }
            const direction = swipeDirection(
              touchObject.startX,
              e.touches[0].pageX,
              touchObject.startY,
              e.touches[0].pageY
            );
            if (direction !== 0) {
              e.preventDefault();
              if (scrollYRef.current) {
                window.scroll(0, scrollYRef.current);
              }
            }
            const length = Math.round(
              Math.sqrt(Math.pow(e.touches[0].pageX - touchObject.startX, 2))
            );
            setTouchObject({
              ...touchObject,
              endX: e.touches[0].pageX,
              endY: e.touches[0].pageY,
              length,
              direction
            });
          }}
          onTouchEnd={handleSwipe}
          onTouchCancel={handleSwipe}
          onMouseDown={e => {
            if (allowDrag) {
              setTouchObject({
                startX: e.clientX,
                startY: e.clientY
              });
              setDragging(true);
            }
          }}
          onMouseMove={e => {
            if (dragging) {
              const direction = swipeDirection(
                touchObject.startX,
                e.clientX,
                touchObject.startY,
                e.clientY
              );
              if (direction !== 0) {
                e.preventDefault();
              }
              let length = Math.round(
                Math.sqrt(Math.pow(e.clientX - touchObject.startX, 2))
              );
              setTouchObject({
                ...touchObject,
                endX: e.clientX,
                endY: e.clientY,
                length,
                direction
              });
            }
          }}
          onMouseUp={e => {
            if (dragging) {
              handleSwipe(e);
            }
          }}
          onMouseLeave={e => {
            if (dragging) {
              handleSwipe(e);
            }
          }}
          onClick={handleClick}
        >
          <Animate
            show
            start={{ tx: 0, ty: 0 }}
            update={() => {
              const { tx, ty } = getOffsetDeltas();
              return {
                tx,
                ty,
                timing: {
                  duration: DEFAULT_DURATION,
                  ease: d3Ease[easing]
                },
                events: {
                  end: () => {
                    const newLeft = getTargetLeft();
                    if (newLeft !== left) {
                      setLeft(newLeft);
                    }
                  }
                }
              };
            }}
          >
            {({ tx, ty }) => (
              <ul
                style={{
                  position: 'relative',
                  transform: `translate3d(${tx}px, ${ty}px, 0)`,
                  display: 'block',
                  margin: `0px ${(cellSpacing / 2) * -1}px`,
                  padding: 0,
                  height: 'auto',
                  width: slideWidth * slideCount + cellSpacing * slideCount,
                  cursor: dragging ? 'pointer' : 'inherit',
                  boxSizing: 'border-box'
                }}
              >
                {slideCount > 1
                  ? formatChildren({
                      children,
                      slideWidth,
                      cellSpacing
                    })
                  : children}
              </ul>
            )}
          </Animate>
        </div>
        {!progressBar && [
          <NavButton
            left
            key={0}
            disabled={currentSlide === 0}
            nextSlide={previousSlide}
          />,
          <div key={1}>
            {slideCount > 5 &&
            currentSlide + slidesToScroll >= slideCount &&
            showAllButton ? (
              <Button
                skeuomorphic
                color="darkerGray"
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
                nextSlide={nextSlide}
              />
            )}
          </div>
        ]}
      </div>
    </ErrorBoundary>
  );

  function formatChildren({ children, slideWidth, cellSpacing }) {
    return React.Children.map(children, (child, index) => (
      <li
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
  }

  function handleClick(e) {
    if (clickSafe) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) {
        e.nativeEvent.stopPropagation();
      }
    }
  }

  function getTargetLeft(touchOffset, slide) {
    const target = slide || currentSlide;
    const offset = 0 - cellSpacing * target - (touchOffset || 0);
    const left = slideWidth * target;
    return (left - offset) * -1;
  }

  function getOffsetDeltas() {
    const offset = getTargetLeft(touchObject.length * touchObject.direction);
    return {
      tx: [offset],
      ty: [0]
    };
  }

  function goToSlide(index) {
    if (index >= slideCount || index < 0) {
      return;
    }
    setEasing(DEFAULT_EASING);
    beforeSlide(currentSlide, index);
    setLeft(getTargetLeft(slideWidth, currentSlide));
    setCurrentSlide(index);
    afterSlide(index);
  }

  function handleSwipe() {
    if (typeof touchObject.length !== 'undefined' && touchObject.length > 44) {
      onClickSafeOn();
    } else {
      onClickSafeOff();
    }
    if (touchObject.length > slideWidth / slidesToShow / 5) {
      if (touchObject.direction === 1) {
        if (currentSlide >= slideCount - slidesToShow) {
          setEasing(DEFAULT_EDGE_EASING);
        } else {
          nextSlide();
        }
      } else if (touchObject.direction === -1) {
        if (currentSlide <= 0) {
          setEasing(DEFAULT_EDGE_EASING);
        } else {
          previousSlide();
        }
      }
    } else {
      goToSlide(currentSlide);
    }
    setTouchObject({});
    setDragging(false);
    scrollYRef.current = null;
  }

  function nextSlide() {
    if (currentSlide < slideCount - slidesToShow) {
      goToSlide(
        Math.min(currentSlide + slidesToScroll, slideCount - slidesToShow)
      );
    }
  }

  function previousSlide() {
    if (currentSlide > 0) {
      goToSlide(Math.max(0, currentSlide - slidesToScroll));
    }
  }

  function onResize() {
    renderDimensions(FrameRef);
  }

  function onReadyStateChange() {
    renderDimensions(FrameRef);
  }

  function renderDimensions(ref) {
    const firstSlide = ref.current.childNodes[0].childNodes[0];
    if (firstSlide) {
      firstSlide.style.height = 'auto';
    }
    setSlideWidth(
      (ref.current.offsetWidth / slidesToShow -
        cellSpacing * (1 - 1 / slidesToShow)) *
        slideWidthMultiplier
    );
  }

  function swipeDirection(x1, x2, y1, y2) {
    const xDist = x1 - x2;
    const yDist = y1 - y2;
    const r = Math.atan2(yDist, xDist);
    const maxAngle = 10;

    let swipeAngle = Math.round((r * 180) / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if (swipeAngle >= 0 && swipeAngle <= maxAngle) {
      return 1;
    }
    if (swipeAngle <= 360 && swipeAngle >= 360 - maxAngle) {
      return 1;
    }
    if (swipeAngle >= 180 - maxAngle && swipeAngle <= 180 + maxAngle) {
      return -1;
    }
    return 0;
  }
}
