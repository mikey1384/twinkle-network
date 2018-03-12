import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'
import Input from 'components/Texts/Input'
import { edit } from 'constants/placeholders'

export default class editTitleModal extends Component {
  static propTypes = {
    onDone: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    title: PropTypes.string
  }

  constructor(props) {
    super()
    this.state = {
      title: props.title
    }
  }

  render() {
    const { onHide, onDone } = this.props
    const { title } = this.state
    return (
      <Modal onHide={onHide}>
        <header>
          Edit Channel Title
        </header>
        <main>
          <form onSubmit={event => this.onSubmit(event, title)}>
            <Input
              autoFocus
              type="text"
              className="form-control"
              placeholder={edit.title}
              value={title}
              onChange={text => this.setState({ title: text })}
            />
          </form>
        </main>
        <footer>
          <Button transparent onClick={onHide}>Cancel</Button>
          <Button primary onClick={() => onDone(title)}>
            Done
          </Button>
        </footer>
      </Modal>
    )
  }

  onSubmit(event, title) {
    event.preventDefault()
    this.props.onDone(title)
  }
}
