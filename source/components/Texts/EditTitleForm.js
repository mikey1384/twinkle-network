import PropTypes from 'prop-types'
import React, {Component} from 'react'
import onClickOutside from 'react-onclickoutside'
import Input from './Input'
import {cleanString, addEmoji, finalizeEmoji} from 'helpers/stringHelpers'

class EditTitleForm extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    maxLength: PropTypes.number,
    onClickOutSide: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    style: PropTypes.object,
    title: PropTypes.string.isRequired
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
    const {style, autoFocus, maxLength = 100} = this.props
    return (
      <form onSubmit={event => this.onEditSubmit(event, title)}>
        <Input
          style={style}
          autoFocus={autoFocus}
          type="text"
          className="form-control"
          placeholder="Enter Title..."
          value={title}
          onChange={text => this.setState({title: text})}
          onKeyUp={event => this.setState({title: addEmoji(event.target.value)})}
        />
        <small style={{color: title.length > maxLength && 'red'}}>{title.length}/{maxLength} Characters</small>
      </form>
    )
  }

  onEditSubmit(event, title) {
    const {onEditSubmit, onClickOutSide, maxLength = 100} = this.props
    event.preventDefault()
    if (title && title.length > maxLength) return
    if (title && title !== this.props.title) {
      onEditSubmit(finalizeEmoji(title))
    } else {
      onClickOutSide()
    }
  }
}

export default onClickOutside(EditTitleForm)
