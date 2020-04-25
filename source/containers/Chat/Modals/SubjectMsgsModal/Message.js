import React from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import FileViewer from 'components/FileViewer';
import { MessageStyle } from '../../Styles';
import { Color } from 'constants/css';
import { unix } from 'moment';

Message.propTypes = {
  id: PropTypes.number,
  content: PropTypes.string,
  fileName: PropTypes.string,
  filePath: PropTypes.string,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isReloadedSubject: PropTypes.number,
  profilePicId: PropTypes.number,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  thumbUrl: PropTypes.string,
  userId: PropTypes.number,
  username: PropTypes.string
};

export default function Message({
  content,
  id: messageId,
  fileName,
  filePath,
  fileSize,
  userId,
  username,
  profilePicId,
  thumbUrl,
  timeStamp,
  isReloadedSubject
}) {
  return (
    <div className={MessageStyle.container}>
      <ProfilePic
        className={MessageStyle.profilePic}
        userId={userId}
        profilePicId={profilePicId}
      />
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
        {filePath && (
          <FileViewer
            modalOverModal
            contentId={messageId}
            contentType="chat"
            content={content}
            filePath={filePath}
            fileName={fileName}
            fileSize={fileSize}
            thumbUrl={thumbUrl}
            style={{ marginTop: '1rem' }}
          />
        )}
        <div>
          <div className={MessageStyle.messageWrapper}>
            <span
              style={{
                color: isReloadedSubject && Color.green(),
                fontWeight: isReloadedSubject && 'bold'
              }}
              dangerouslySetInnerHTML={{
                __html: isReloadedSubject ? 'Brought back the subject' : content
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
