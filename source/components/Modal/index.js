import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import { borderRadius, Color } from 'constants/css'
import Content from './Content'

export default class Modal extends Component {
  static propTypes = {
    children: PropTypes.node,
    onHide: PropTypes.func
  }
  render() {
    const { children, onHide } = this.props
    return (
      <div
        className={css`
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: ${Color.black(0.5)};
        `}
      >
        <Content
          className={css`
            position: relative;
            border-radius: ${borderRadius};
            background: #fff;
            width: 50%;
            min-height: 30vh;
            margin-left: 25%;
            margin-top: 13vh;
            box-shadow: 3px 4px 5px ${Color.black(1)};
            display: flex;
            justify-content: center;
            flex-direction: column;
            height: auto;
            .close {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.5rem;
              top: 1rem;
              right: 1rem;
              border: none;
              width: 1.5rem;
              height: 1.5rem;
              cursor: pointer;
              position: absolute;
              opacity: 0.5;
              &:hover {
                opacity: 1;
              }
            }
            .heading {
              display: flex;
              align-items: center;
              line-height: 2rem;
              color: ${Color.darkGray()};
              font-weight: bold;
              font-size: 2rem;
              padding: 2rem;
              padding-top: 2.5rem;
            }
            .body {
              display: flex;
              padding: 1.5rem;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              min-height: 20vh;
            }
            .footer {
              margin-top: 3rem;
              display: flex;
              align-items: center;
            }
          `}
          onHide={onHide}
        >
          {children}
        </Content>
      </div>
    )
  }
}
