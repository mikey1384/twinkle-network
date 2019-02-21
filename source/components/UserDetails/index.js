import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import StatusInput from './StatusInput';
import Button from 'components/Button';
import Icon from 'components/Icon';
import BioEditModal from 'components/Modals/BioEditModal';
import ConfirmModal from 'components/Modals/ConfirmModal';
import request from 'axios';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import StatusMsg from './StatusMsg';
import Bio from 'components/Texts/Bio';
import { auth } from 'helpers/requestHelpers';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { addEmoji, finalizeEmoji, renderText } from 'helpers/stringHelpers';
import URL from 'constants/URL';

UserDetails.propTypes = {
  isProfilePage: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  removeStatusMsg: PropTypes.func,
  style: PropTypes.object,
  unEditable: PropTypes.bool,
  updateStatusMsg: PropTypes.func,
  uploadBio: PropTypes.func,
  userId: PropTypes.number,
  small: PropTypes.bool
};

export default function UserDetails({
  isProfilePage,
  profile,
  removeStatusMsg,
  small,
  style = {},
  unEditable,
  updateStatusMsg,
  uploadBio,
  userId
}) {
  const [bioEditModalShown, setBioEditModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [editedStatusMsg, setEditedStatusMsg] = useState('');
  const [editedStatusColor, setEditedStatusColor] = useState('');
  const StatusInputRef = useRef(null);
  const statusColor = editedStatusColor || profile.statusColor || 'logoBlue';
  const { profileFirstRow, profileSecondRow, profileThirdRow } = profile;
  const noProfile = !profileFirstRow && !profileSecondRow && !profileThirdRow;

  return (
    <ErrorBoundary
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      <Link
        to={isProfilePage ? null : `/users/${profile.username}`}
        style={{
          fontSize: small ? '3rem' : '3.5rem',
          fontWeight: 'bold',
          color: Color.darkerGray(),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 'normal',
          textDecoration: 'none'
        }}
        className={
          isProfilePage
            ? ''
            : css`
                transition: color 0.2s;
                &:hover {
                  color: ${Color[
                    profile.profileTheme || 'logoBlue'
                  ]()}!important;
                }
              `
        }
      >
        {profile.username}
      </Link>
      <p
        style={{ fontSize: small ? '1.3rem' : '1.5rem', color: Color.gray() }}
      >{`(${profile.realName})`}</p>
      {userId === profile.id && !unEditable && (
        <StatusInput
          innerRef={StatusInputRef}
          profile={profile}
          statusColor={statusColor}
          editedStatusMsg={editedStatusMsg}
          setColor={setEditedStatusColor}
          onTextChange={event => {
            setEditedStatusMsg(addEmoji(renderText(event.target.value)));
            if (!event.target.value) {
              setEditedStatusColor('');
            }
          }}
          onCancel={() => {
            setEditedStatusMsg('');
            setEditedStatusColor('');
          }}
          onStatusSubmit={onStatusMsgSubmit}
        />
      )}
      {(profile.statusMsg || editedStatusMsg) && (
        <StatusMsg
          statusColor={statusColor}
          statusMsg={editedStatusMsg || profile.statusMsg}
        />
      )}
      {profile.statusMsg &&
        !editedStatusMsg &&
        userId === profile.id &&
        !unEditable && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}
          >
            <Button
              transparent
              onClick={() => {
                setEditedStatusMsg(profile.statusMsg);
                StatusInputRef.current.focus();
              }}
            >
              <Icon icon="pencil-alt" />
              <span style={{ marginLeft: '0.7rem' }}>Change</span>
            </Button>
            <Button
              transparent
              style={{ marginLeft: '1rem' }}
              onClick={() => setConfirmModalShown(true)}
            >
              <Icon icon="trash-alt" />
              <span style={{ marginLeft: '0.7rem' }}>Remove</span>
            </Button>
          </div>
        )}
      {!noProfile && (
        <Bio
          small={small}
          firstRow={profileFirstRow}
          secondRow={profileSecondRow}
          thirdRow={profileThirdRow}
        />
      )}
      {noProfile &&
        (userId === profile.id && !unEditable ? (
          <div style={{ padding: '4rem 1rem 3rem 1rem' }}>
            <a
              style={{
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '2rem'
              }}
              onClick={() => setBioEditModalShown(true)}
            >
              Introduce yourself!
            </a>
          </div>
        ) : (
          <div
            style={{
              height: '6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <span>
              {profile.username} {`does not have a bio, yet`}
            </span>
          </div>
        ))}
      {bioEditModalShown && (
        <BioEditModal
          firstLine={profileFirstRow}
          secondLine={profileSecondRow}
          thirdLine={profileThirdRow}
          onSubmit={handleUploadBio}
          onHide={() => setBioEditModalShown(false)}
        />
      )}
      {confirmModalShown && (
        <ConfirmModal
          onConfirm={onRemoveStatus}
          onHide={() => setConfirmModalShown(false)}
          title={`Remove Status Message`}
        />
      )}
    </ErrorBoundary>
  );

  async function onRemoveStatus() {
    await request.delete(`${URL}/user/statusMsg`, auth());
    removeStatusMsg(userId);
    setConfirmModalShown(false);
  }

  async function onStatusMsgSubmit() {
    const statusMsg = finalizeEmoji(editedStatusMsg);
    const statusColor = editedStatusColor || profile.statusColor;
    const { data } = await request.post(
      `${URL}/user/statusMsg`,
      {
        statusMsg,
        statusColor
      },
      auth()
    );
    setEditedStatusColor('');
    setEditedStatusMsg('');
    if (typeof updateStatusMsg === 'function') updateStatusMsg(data);
  }

  async function handleUploadBio(params) {
    if (typeof uploadBio === 'function') {
      await uploadBio({ ...params, profileId: profile.id });
      setBioEditModalShown(false);
    }
  }
}
