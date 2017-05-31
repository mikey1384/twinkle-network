import PropTypes from 'prop-types'
import React, {Component} from 'react'
import onClickOutside from 'react-onclickoutside'
import {cleanString, addEmoji, finalizeEmoji} from 'helpers/stringHelpers'

class EditTitleForm extends Component {
  static propTypes = {
    onClickOutSide: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
    autoFocus: PropTypes.bool
  }

  handleClickOutside = (event) => {
    this.props.onClickOutSide()
  }

  constructor(props) {
    super()
    this.state = {
      title: cleanString(props.title)
    }
    this.onEditSubmit = this.onEditSubmit.bind(this)
  }

  render() {
    const {title} = this.state
    const {style, autoFocus} = this.props
    return (
      <form onSubmit={event => this.onEditSubmit(event, title)}>
        <input
          style={style}
          autoFocus={autoFocus}
          type="text"
          className="form-control"
          placeholder="Enter Title..."
          value={title}
          onChange={event => this.setState({title: event.target.value})}
          onKeyUp={event => this.setState({title: addEmoji(event.target.value)})}
        />
      </form>
    )
  }

  onEditSubmit(event, title) {
    event.preventDefault()
    if (title && title !== this.props.title) {
      this.props.onEditSubmit(finalizeEmoji(title))
    } else {
      this.props.onClickOutSide()
    }
  }
}

export default onClickOutside(EditTitleForm)
