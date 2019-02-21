import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import request from 'axios';
import Message from './Message';
import Loading from 'components/Loading';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { Color } from 'constants/css';
import { queryStringForArray } from 'helpers/stringHelpers';
import URL from 'constants/URL';

const API_URL = `${URL}/chat`;

SubjectMsgsModal.propTypes = {
  onHide: PropTypes.func,
  subjectId: PropTypes.number,
  subjectTitle: PropTypes.string
};

export default function SubjectMsgsModal({ onHide, subjectId, subjectTitle }) {
  const [loading, setLoading] = useState(false);
  const [loadMoreButtonShown, setLoadMoreButtonShown] = useState(false);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    loadMessages();
    async function loadMessages() {
      try {
        const {
          data: { messages, loadMoreButtonShown }
        } = await request.get(
          `${API_URL}/chatSubject/messages?subjectId=${subjectId}`
        );
        setMessages(messages);
        setLoadMoreButtonShown(loadMoreButtonShown);
      } catch (error) {
        console.error(error.response || error);
      }
    }
  }, []);

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
            onClick={onLoadMoreButtonClick}
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

  async function onLoadMoreButtonClick() {
    setLoading(true);
    const queryString = queryStringForArray({
      array: messages,
      originVar: 'id',
      destinationVar: 'messageIds'
    });
    try {
      const {
        data: { messages: loadedMsgs, loadMoreButtonShown }
      } = await request.get(
        `${API_URL}/chatSubject/messages/more?subjectId=${subjectId}&${queryString}`
      );
      setLoading(false);
      setMessages(loadedMsgs.concat(messages));
      setLoadMoreButtonShown(loadMoreButtonShown);
    } catch (error) {
      console.error(error.response || error);
    }
  }
}
