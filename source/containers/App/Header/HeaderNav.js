import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Link, Route} from 'react-router-dom'

export default class HeaderNav extends Component {
  static propTypes = {
    to: PropTypes.string,
    children: PropTypes.node,
    isUsername: PropTypes.bool,
    isHome: PropTypes.bool,
    onClick: PropTypes.func,
    imgLabel: PropTypes.string,
    style: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      hovered: false
    }
  }

  render() {
    const {imgLabel, style = {}, to, children, isHome, isUsername, onClick, ...props} = this.props
    const {hovered} = this.state
    return (
      <Route path={to} exact={isHome && !isUsername} children={({match}) => (
        <li
          {...props}
          className={`header-nav ${match ? 'active' : ''}`}
          onClick={() => { if (onClick) onClick() }}
          onMouseEnter={() => this.setState({hovered: true})}
          onMouseLeave={() => this.setState({hovered: false})}
        >
          <Link style={style} to={to}>
            <div className="flexbox-container">
              <span className={`nav-icon-${imgLabel}${(match || hovered) ? '-hovered' : ''}`} />
              {children}
              <div className="clear-fix" />
            </div>
          </Link>
        </li>
      )}/>
    )
  }
}
