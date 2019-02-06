import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { Color } from 'constants/css';
import request from 'axios';
import Message from './Message';
import Loading from 'components/Loading';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { queryStringForArray } from 'helpers/stringHelpers';

const { URL } = process.env;
const API_URL = `${URL}/chat`;

export default class SubjectMsgsModal extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    subjectId: PropTypes.number,
    subjectTitle: PropTypes.string
  };

  state = {
    loading: false,
    loadMoreButtonShown: false,
    messages: []
  };

  componentDidMount() {
    const { subjectId } = this.props;
    return request
      .get(`${API_URL}/chatSubject/messages?subjectId=${subjectId}`)
      .then(({ data: { messages, loadMoreButtonShown } }) =>
        this.setState({ messages, loadMoreButtonShown })
      )
      .catch(error => console.error(error.response || error));
  }

  render() {
    const { onHide, subjectTitle } = this.props;
    const { messages, loading, loadMoreButtonShown } = this.state;
    return (
      <Modal onHide={onHide}>
        <header>
          <span style={{ color: Color.green() }}>{subjectTitle}</span>
        </header>
        <main>
          {loadMoreButtonShown && (
            <LoadMoreButton
              filled
              info
              onClick={this.onLoadMoreButtonClick}
              loading={loading}
            />
          )}
          {messages.length === 0 && <Loading />}
          {messages.map(message => (
            <Message key={message.id} {...message} />
          ))}
        </main>
        <footer>
          <Button transparent onClick={onHide}>
            Close
          </Button>
        </footer>
      </Modal>
    );
  }

  onLoadMoreButtonClick = () => {
    const { subjectId } = this.props;
    const { messages } = this.state;
    this.setState({ loading: true });
    return request
      .get(
        `
      ${API_URL}/chatSubject/messages/more?subjectId=${subjectId}
      &${queryStringForArray({
        array: messages,
        originVar: 'id',
        destinationVar: 'messageIds'
      })}
    `
      )
      .then(({ data: { messages: loadedMsgs, loadMoreButtonShown } }) =>
        this.setState({
          loading: false,
          messages: loadedMsgs.concat(messages),
          loadMoreButtonShown
        })
      )
      .catch(error => console.error(error.response || error));
  };
}
