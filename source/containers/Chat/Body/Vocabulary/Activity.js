import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import WordModal from './WordModal';
import { returnWordLevel } from 'helpers';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { rewardHash } from 'constants/defaultValues';
import { MessageStyle } from '../../Styles';
import { Color } from 'constants/css';
import { unix } from 'moment';
import { socket } from 'constants/io';
import { useChatContext } from 'contexts';

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
  setScrollToBottom: PropTypes.func.isRequired,
  isLastActivity: PropTypes.bool,
  myId: PropTypes.number
};

export default function Activity({
  activity,
  activity: {
    content,
    frequency,
    isNewActivity,
    userId,
    username,
    profilePicId,
    timeStamp
  },
  setScrollToBottom,
  isLastActivity,
  myId
}) {
  const {
    actions: { onRemoveNewActivityStatus }
  } = useChatContext();
  const [wordModalShown, setWordModalShown] = useState(false);
  const userIsUploader = myId === userId;
  useEffect(() => {
    if (isLastActivity && userIsUploader) {
      setScrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isNewActivity && isLastActivity && userIsUploader) {
      handleSendActivity();
    }
    async function handleSendActivity() {
      socket.emit('new_vocab_activity', activity);
      onRemoveNewActivityStatus(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wordLevel = useMemo(
    () => returnWordLevel({ frequency, wordLength: content.length }),
    [content.length, frequency]
  );
  return (
    <div className={MessageStyle.container}>
      <div className={MessageStyle.profilePic}>
        <ProfilePic
          style={{ width: '100%', height: '100%' }}
          userId={userId}
          profilePicId={profilePicId}
        />
      </div>
      <div className={MessageStyle.contentWrapper}>
        <div>
          <UsernameText
            style={MessageStyle.usernameText}
            user={{
              id: userId,
              username: username
            }}
          />{' '}
          <span className={MessageStyle.timeStamp}>
            {unix(timeStamp).format('LLL')}
          </span>
        </div>
        <div>
          registered {wordLevel === 1 ? 'a' : 'an'}{' '}
          <b
            style={{
              fontSize: '1.7rem',
              color: Color[rewardHash[wordLevel].color]()
            }}
          >
            {rewardHash[wordLevel].label}
          </b>{' '}
          word,{' '}
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '3rem',
              color: Color.blue(),
              cursor: 'pointer'
            }}
            onClick={() => setWordModalShown(true)}
          >
            {content}
          </span>{' '}
          and earned{' '}
          <b style={{ fontSize: '1.7rem' }}>
            <span style={{ color: Color.logoGreen() }}>
              {addCommasToNumber(rewardHash[wordLevel].rewardAmount)}
            </span>{' '}
            <span style={{ color: Color.gold() }}>XP</span>
          </b>
        </div>
      </div>
      {wordModalShown && (
        <WordModal word={content} onHide={() => setWordModalShown(false)} />
      )}
    </div>
  );
}
