import PropTypes from 'prop-types'
import React, {Component} from 'react'
import onClickOutside from 'react-onclickoutside'
import {cleanString} from 'helpers/stringHelpers'

class EditTitleForm extends Component {
  static propTypes = {
    onClickOutSide: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
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
  }

  render() {
    const {title} = this.state
    return (
      <form onSubmit={event => this.onEditSubmit(event, title)}>
        <input
          autoFocus
          ref="editTitleInput"
          type="text"
          className="form-control"
          placeholder="Enter Title..."
          value={title}
          onChange={event => this.setState({title: event.target.value})}
        />
      </form>
    )
  }

  onEditSubmit(event, title) {
    event.preventDefault()
    this.props.onEditSubmit(title)
  }
}

export default onClickOutside(EditTitleForm)
