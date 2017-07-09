import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'
import {Color} from 'constants/css'
import request from 'axios'
import {URL} from 'constants/URL'
import Message from './Message'
import LoadMoreButton from 'components/LoadMoreButton'
import {queryStringForArray} from 'helpers/apiHelpers'

const API_URL = `${URL}/chat`

export default class PastMsgsModal extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    subjectId: PropTypes.number,
    subjectTitle: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      messages: [],
      loadMoreButtonShown: false,
      loading: false
    }
    this.onLoadMoreButtonClick = this.onLoadMoreButtonClick.bind(this)
  }

  componentDidMount() {
    const {subjectId} = this.props
    return request.get(`${API_URL}/chatSubject/messages?subjectId=${subjectId}`).then(
      ({data: {messages, loadMoreButtonShown}}) => this.setState({messages, loadMoreButtonShown})
    ).catch(
      error => console.error(error.response || error)
    )
  }

  render() {
    const {onHide, subjectTitle} = this.props
    const {messages, loading, loadMoreButtonShown} = this.state
    return (
      <Modal
        show
        onHide={onHide}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4 style={{color: Color.green}}>{subjectTitle}</h4>
        </Modal.Header>
        <Modal.Body>
          {loadMoreButtonShown && <LoadMoreButton
            onClick={this.onLoadMoreButtonClick}
            loading={loading}
          />}
          {messages.map(message => <Message key={message.id} {...message} />)}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-default"
            onClick={onHide}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  onLoadMoreButtonClick() {
    const {subjectId} = this.props
    const {messages} = this.state
    return request.get(`
      ${API_URL}/chatSubject/messages/more?subjectId=${subjectId}
      &${queryStringForArray(messages, 'id', 'messageIds')}
    `).then(
      ({data: {messages: loadedMsgs, loadMoreButtonShown}}) => this.setState({
        messages: loadedMsgs.concat(messages), loadMoreButtonShown
      })
    ).catch(
      error => console.error(error.response || error)
    )
  }
}
