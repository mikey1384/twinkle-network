import React, { Component } from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'

class Content extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node
  }

  state = {
    innerClicked: false
  }

  handleClickOutside = event => {
    if (this.state.innerClicked) return this.setState({ innerClicked: false })
    this.props.onHide()
  }
  render() {
    return (
      <div
        onMouseDown={() => this.setState({ innerClicked: true })}
        onMouseUp={() => this.setState({ innerClicked: false })}
        className={this.props.className}
      >
        <button className="close" onClick={this.props.onHide}>
          <span className="glyphicon glyphicon-remove" />
        </button>
        {this.props.children}
      </div>
    )
  }
}

export default onClickOutside(Content)
