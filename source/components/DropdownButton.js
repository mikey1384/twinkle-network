import PropTypes from 'prop-types'
import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Button from './Button'
import DropdownList from 'components/DropdownList'

class DropdownButton extends Component {
  static propTypes = {
    icon: PropTypes.string,
    direction: PropTypes.string,
    listStyle: PropTypes.object,
    menuProps: PropTypes.array.isRequired,
    noBorderRadius: PropTypes.bool,
    opacity: PropTypes.number,
    stretch: PropTypes.bool,
    style: PropTypes.object,
    text: PropTypes.string
  }

  handleClickOutside = event => {
    this.setState({ menuDisplayed: false })
  }

  state = {
    menuDisplayed: false
  }

  render() {
    const { menuDisplayed } = this.state
    const {
      direction,
      opacity = 1,
      style,
      icon = 'pencil',
      listStyle = {},
      noBorderRadius,
      text = '',
      stretch,
      ...props
    } = this.props
    return (
      <div
        style={{
          opacity: menuDisplayed ? 1 : opacity,
          position: 'relative',
          ...style
        }}
      >
        <Button
          {...props}
          style={{
            borderRadius: noBorderRadius && 0,
            border: noBorderRadius && 0,
            margin: noBorderRadius && 0,
            width: stretch && '100%'
          }}
          onClick={() => this.setState({ menuDisplayed: !menuDisplayed })}
        >
          <span className={`glyphicon glyphicon-${icon}`} />
          {text && <span>&nbsp;&nbsp;</span>}
          <span>{text}</span>
        </Button>
        {menuDisplayed && (
          <DropdownList
            style={{
              minWidth: '12rem',
              ...listStyle
            }}
            direction={direction}
          >
            {this.renderMenu()}
          </DropdownList>
        )}
      </div>
    )
  }

  renderMenu = () => {
    const { menuProps } = this.props
    return menuProps.map((prop, index) => {
      if (prop.separator) {
        return <hr />
      }
      return (
        <li onClick={() => this.handleMenuClick(prop.onClick)} key={index}>
          {prop.label}
        </li>
      )
    })
  }

  handleMenuClick = action => {
    action()
    this.setState({ menuDisplayed: false })
  }
}

export default onClickOutside(DropdownButton)
