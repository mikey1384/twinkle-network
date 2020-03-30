import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import ErrorBoundary from 'components/ErrorBoundary';
import Content from './Content';

Modal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  modalOverModal: PropTypes.bool,
  onHide: PropTypes.func,
  small: PropTypes.bool,
  large: PropTypes.bool,
  modalStyle: PropTypes.object,
  style: PropTypes.object
};

export default function Modal({
  className,
  children,
  modalOverModal,
  onHide,
  small,
  large,
  modalStyle,
  style
}) {
  const modalWidth = {
    default: '50%',
    small: '26%',
    large: '80%'
  };
  const marginLeft = {
    default: '25%',
    small: '37%',
    large: '10%'
  };
  const widthKey = small ? 'small' : large ? 'large' : 'default';
  const Modal = (
    <ErrorBoundary>
      <div
        className={`${css`
          position: fixed;
          z-index: 50000;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
        `} ${className}`}
      >
        <div
          className={css`
            position: absolute;
            z-index: 500;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            padding-bottom: 7rem;
            background: ${Color.black(0.5)};
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
          `}
          style={style}
        >
          <Content
            style={modalStyle}
            eventTypes={['mouseup']}
            className={css`
              position: relative;
              border-radius: ${borderRadius};
              background: #fff;
              width: ${modalWidth[widthKey]};
              min-height: 30vh;
              top: 3rem;
              margin-left: ${marginLeft[widthKey]};
              box-shadow: 3px 4px 5px ${Color.black()};
              display: flex;
              justify-content: flex-start;
              flex-direction: column;
              height: auto;
              .close {
                color: ${Color.darkerGray()};
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                position: absolute;
                top: 1rem;
                right: 1rem;
                border: none;
                width: 1.5rem;
                height: 1.5rem;
                cursor: pointer;
                opacity: 0.5;
                &:hover {
                  opacity: 1;
                }
              }
              > header {
                display: flex;
                align-items: center;
                line-height: 1.5;
                color: ${Color.black()};
                font-weight: bold;
                font-size: 2rem;
                padding: 2rem;
                margin-top: 0.5rem;
              }
              > main {
                display: flex;
                padding: 1.5rem 2rem;
                font-size: 1.5rem;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                min-height: 20vh;
              }
              > footer {
                padding: 1.5rem 1.5rem 1.5rem 1.5rem;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                border-top: 1px solid ${Color.borderGray()};
              }
              @media (max-width: ${mobileMaxWidth}) {
                width: 100% !important;
                margin: 0;
              }
            `}
            onHide={onHide}
          >
            {children}
          </Content>
        </div>
      </div>
    </ErrorBoundary>
  );
  return modalOverModal
    ? Modal
    : createPortal(Modal, document.getElementById('modal'));
}
