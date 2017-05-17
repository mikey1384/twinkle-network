import PropTypes from 'prop-types'
import React, {Component} from 'react'
import onClickOutside from 'react-onclickoutside'
import Button from './Button'

class SmallDropdownButton extends Component {
  static propTypes = {
    menuProps: PropTypes.array.isRequired,
    opacity: PropTypes.number,
    style: PropTypes.object,
    shape: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.string,
    text: PropTypes.string,
    align: PropTypes.string
  }

  handleClickOutside = event => {
    this.setState({menuDisplayed: false})
  }

  constructor() {
    super()
    this.state = {
      menuDisplayed: false
    }
  }

  render() {
    const {menuDisplayed} = this.state
    const {opacity = 1, style, shape, size = 'sm', icon, text = '', align = 'right'} = this.props
    const buttonShape = shape === 'button' ? `btn btn-${size} btn-default` : 'dropdown-toggle'
    return (
      <span
        className={`dropdown pull-${align}`}
        style={{
          ...style,
          opacity: menuDisplayed ? 1 : opacity
        }}>
        <Button className={buttonShape} onClick={() => this.setState({menuDisplayed: !menuDisplayed})}>
          <span className={`glyphicon glyphicon-${icon}`}></span>{text && <span>&nbsp;&nbsp;</span>}<span>{text}</span>
        </Button>
        <ul className="dropdown-menu"
          style={{
            cursor: 'pointer',
            display: menuDisplayed ? 'block' : 'none'
          }}
        >
          {this.renderMenu()}
        </ul>
      </span>
    )
  }

  renderMenu() {
    const {menuProps} = this.props
    return menuProps.map((prop, index) => {
      if (prop.separator) {
        return (
          <li
            key={index}
            role="separator"
            className="divider"
          />
        )
      }
      return (
        <li
          onClick={() => this.handleMenuClick(prop.onClick)}
          key={index}
        >
          <a>{prop.label}</a>
        </li>
      )
    })
  }

  handleMenuClick(action) {
    action()
    this.setState({menuDisplayed: false})
  }
}

export default onClickOutside(SmallDropdownButton)
