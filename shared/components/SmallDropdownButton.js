import React, {Component, PropTypes} from 'react';
import onClickOutside from 'react-onclickoutside';

class SmallDropdownButton extends Component {
  static propTypes = {
    menuProps: PropTypes.array.isRequired,
    icon: PropTypes.string,
    shape: PropTypes.string,
    style: PropTypes.object
  }
  
  handleClickOutside = event => {
    this.setState({menuDisplayed: false});
  }

  constructor() {
    super()
    this.state = {
      menuDisplayed: false
    }
  }

  render () {
    const {menuDisplayed} = this.state;
    const {style, icon, shape} = this.props;
    const buttonIcon = icon === 'pencil' ? 'glyphicon glyphicon-pencil' : 'glyphicon glyphicon-align-justify';
    const buttonShape = shape === 'button' ? 'btn btn-sm btn-default' : 'dropdown-toggle'
    const menuDisplay = menuDisplayed ? 'block' : 'none';

    return (
      <span
        className="dropdown pull-right"
        style={style}>
        <button className={buttonShape} onClick={() => this.setState({menuDisplayed: !menuDisplayed})}>
          <span className={buttonIcon}></span>
        </button>
        <ul className="dropdown-menu"
          style={{
            cursor: 'pointer',
            display: menuDisplay
          }}
        >
          {this.renderMenu()}
        </ul>
      </span>
    )
  }

  renderMenu() {
    const {menuProps} = this.props;
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
    action();
    this.setState({menuDisplayed: false});
  }
}

export default onClickOutside(SmallDropdownButton)
