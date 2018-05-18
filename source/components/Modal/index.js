import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { hideMobileNavbar, showMobileNavbar } from 'redux/actions/ViewActions'
import Content from './Content'
import { connect } from 'react-redux'

class Modal extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    hideMobileNavbar: PropTypes.func.isRequired,
    showMobileNavbar: PropTypes.func.isRequired,
    onHide: PropTypes.func,
    small: PropTypes.bool,
    large: PropTypes.bool,
    style: PropTypes.object
  }

  componentDidMount() {
    const { hideMobileNavbar } = this.props
    hideMobileNavbar()
  }

  componentWillUnmount() {
    const { showMobileNavbar } = this.props
    showMobileNavbar()
  }

  render() {
    const { className, children, onHide, small, large, style } = this.props
    const modalWidth = {
      default: '50%',
      small: '26%',
      large: '80%'
    }
    const marginLeft = {
      default: '25%',
      small: '37%',
      large: '10%'
    }
    const widthKey = small ? 'small' : large ? 'large' : 'default'
    return (
      <div
        className={`${css`
          position: fixed;
          z-index: 2500;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
        `} ${className}`}
      >
        <div
          className={css`
            position: absolute;
            z-index: 2500;
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
                color: ${Color.darkGray()};
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
                line-height: 2rem;
                color: ${Color.darkGray()};
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
                flex-direction: row-reverse;
                border-top: 1px solid ${Color.inputBorderGray()};
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
    )
  }
}

export default connect(null, { hideMobileNavbar, showMobileNavbar })(Modal)
