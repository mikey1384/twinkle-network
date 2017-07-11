import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Button, Modal} from 'react-bootstrap'

export default class editTitleModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    title: PropTypes.string
  }

  constructor(props) {
    super()
    this.state = {
      title: props.title
    }
  }

  render() {
    const {onHide, onDone} = this.props
    const {title} = this.state
    return (
      <Modal
        show
        onHide={onHide}
        animation={false}
      >
        <Modal.Header>
          <h4>Edit Channel Title</h4>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={event => this.onSubmit(event, title)}>
            <input
              autoFocus
              type="text"
              className="form-control"
              placeholder="Enter Title..."
              value={title}
              onChange={event => this.setState({title: event.target.value})}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={() => onDone(title)}
          >Done</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  onSubmit(event, title) {
    event.preventDefault()
    this.props.onDone(title)
  }
}
