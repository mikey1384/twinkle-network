import PropTypes from 'prop-types'
import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Button from 'components/Button'
import DropdownList from 'components/DropdownList'

class DropdownButton extends Component {
  static propTypes = {
    icon: PropTypes.string,
    direction: PropTypes.string,
    onButtonClick: PropTypes.func,
    listStyle: PropTypes.object,
    menuProps: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func
      })
    ),
    noBorderRadius: PropTypes.bool,
    opacity: PropTypes.number,
    stretch: PropTypes.bool,
    style: PropTypes.object,
    text: PropTypes.string
  }

  handleClickOutside = event => {
    const { onButtonClick } = this.props
    if (typeof onButtonClick === 'function') onButtonClick(true)
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
          onClick={this.onClick}
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

  onClick = () => {
    const { menuDisplayed } = this.state
    const { onButtonClick } = this.props
    if (typeof onButtonClick === 'function') onButtonClick(menuDisplayed)
    this.setState({ menuDisplayed: !menuDisplayed })
  }

  renderMenu = () => {
    const { menuProps } = this.props
    return menuProps.map((prop, index) => {
      if (prop.separator) {
        return <hr key={index} />
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
