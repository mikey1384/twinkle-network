import React from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import FileViewer from '../../Message/FileViewer';
import { MessageStyle } from '../../Styles';
import { Color } from 'constants/css';
import moment from 'moment';

Message.propTypes = {
  fileName: PropTypes.string,
  filePath: PropTypes.string,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userId: PropTypes.number,
  username: PropTypes.string,
  profilePicId: PropTypes.number,
  content: PropTypes.string,
  isReloadedSubject: PropTypes.number,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default function Message({
  content,
  fileName,
  filePath,
  fileSize,
  userId,
  username,
  profilePicId,
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
            {moment.unix(timeStamp).format('LLL')}
          </span>
        </div>
        {filePath && (
          <FileViewer
            modalOverModal
            content={content}
            filePath={filePath}
            fileName={fileName}
            fileSize={fileSize}
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
