import PropTypes from 'prop-types'
import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Button from './Button'
import { Color } from 'constants/css'
import { css } from 'emotion'

class DropdownButton extends Component {
  static propTypes = {
    icon: PropTypes.string,
    direction: PropTypes.string,
    menuProps: PropTypes.array.isRequired,
    opacity: PropTypes.number,
    style: PropTypes.object,
    text: PropTypes.string
  }

  handleClickOutside = event => {
    this.setState({ menuDisplayed: false })
  }

  constructor() {
    super()
    this.state = {
      menuDisplayed: false
    }
  }

  render() {
    const { menuDisplayed } = this.state
    const { direction = 'left', opacity = 1, style, icon = 'pencil', text = '' } = this.props
    return (
      <div
        style={{
          ...style,
          opacity: menuDisplayed ? 1 : opacity
        }}
      >
        <Button
          onClick={() => this.setState({ menuDisplayed: !menuDisplayed })}
        >
          <span className={`glyphicon glyphicon-${icon}`} />
          {text && <span>&nbsp;&nbsp;</span>}
          <span>{text}</span>
        </Button>
        <div
          className={css`
            position: relative;
            float: right;
            width: 100%;
          `}
        >
          <ul
            className={css`
              padding: 0;
              z-index: 10;
              margin-top: 0.5rem;
              top: 0;
              left: ${direction === 'left' ? '-6rem' : '0'};
              right: ${direction === 'right' ? '-6rem' : '0'};
              border: none;
              list-style: none;
              position: absolute;
              cursor: pointer;
              background: #fff;
              display: ${menuDisplayed ? 'block' : 'none'};
              box-shadow: 1px 1px 2px ${Color.black(0.49)};
              li {
                width: 100%;
                padding: 1rem;
                text-align: center;
                font-size: 1.5rem;
                color: ${Color.darkGray()};
                cursor: pointer;
                &:hover {
                  background: ${Color.headingGray()};
                }
              }
            `}
          >
            {this.renderMenu()}
          </ul>
        </div>
      </div>
    )
  }

  renderMenu() {
    const { menuProps } = this.props
    return menuProps.map((prop, index) => {
      if (prop.separator) {
        return <li key={index} role="separator" />
      }
      return (
        <li onClick={() => this.handleMenuClick(prop.onClick)} key={index}>
          {prop.label}
        </li>
      )
    })
  }

  handleMenuClick(action) {
    action()
    this.setState({ menuDisplayed: false })
  }
}

export default onClickOutside(DropdownButton)
