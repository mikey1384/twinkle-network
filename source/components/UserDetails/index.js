import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import StatusInput from './StatusInput';
import Button from 'components/Button';
import Icon from 'components/Icon';
import BioEditModal from 'components/Modals/BioEditModal';
import ConfirmModal from 'components/Modals/ConfirmModal';
import request from 'axios';
import ErrorBoundary from 'components/ErrorBoundary';
import StatusMsg from './StatusMsg';
import Bio from 'components/Texts/Bio';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { addEmoji, finalizeEmoji, renderText } from 'helpers/stringHelpers';
import URL from 'constants/URL';
import {
  useAppContext,
  useContentContext,
  useInputContext,
  useProfileContext
} from 'contexts';

UserDetails.propTypes = {
  noLink: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  removeStatusMsg: PropTypes.func,
  style: PropTypes.object,
  unEditable: PropTypes.bool,
  updateStatusMsg: PropTypes.func,
  onUpdateBio: PropTypes.func,
  userId: PropTypes.number,
  small: PropTypes.bool
};

export default function UserDetails({
  noLink,
  profile,
  removeStatusMsg,
  small,
  style = {},
  unEditable,
  updateStatusMsg,
  onUpdateBio,
  userId
}) {
  const {
    requestHelpers: { auth, uploadBio }
  } = useAppContext();
  const {
    actions: { onReloadContent }
  } = useContentContext();
  const {
    state: { editedStatusColor, editedStatusMsg },
    actions: { onSetEditedStatusColor, onSetEditedStatusMsg }
  } = useInputContext();
  const {
    actions: { onResetProfile }
  } = useProfileContext();
  const [bioEditModalShown, setBioEditModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  useEffect(() => {
    onSetEditedStatusColor('');
  }, [userId]);
  const StatusInputRef = useRef(null);
  const statusColor =
    (userId === profile.id
      ? editedStatusColor || profile.statusColor
      : profile.statusColor) || 'logoBlue';
  const { profileFirstRow, profileSecondRow, profileThirdRow } = profile;
  const noProfile = !profileFirstRow && !profileSecondRow && !profileThirdRow;
  const displayedStatusMsg =
    userId === profile.id && editedStatusMsg
      ? editedStatusMsg
      : profile.statusMsg;

  return (
    <ErrorBoundary
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      <Link
        to={noLink ? null : `/users/${profile.username}`}
        onClick={handleReloadProfile}
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
          noLink
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
          setColor={onSetEditedStatusColor}
          onTextChange={event => {
            onSetEditedStatusMsg(addEmoji(renderText(event.target.value)));
            if (!event.target.value) {
              onSetEditedStatusColor('');
            }
          }}
          onCancel={() => {
            onSetEditedStatusMsg('');
            onSetEditedStatusColor('');
          }}
          onStatusSubmit={onStatusMsgSubmit}
        />
      )}
      {(profile.statusMsg || displayedStatusMsg) && (
        <StatusMsg statusColor={statusColor} statusMsg={displayedStatusMsg} />
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
                onSetEditedStatusMsg(profile.statusMsg);
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

  function handleReloadProfile() {
    onReloadContent({
      contentId: profile.id,
      contentType: 'user'
    });
    onResetProfile(profile.username);
  }

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
    onSetEditedStatusColor('');
    onSetEditedStatusMsg('');
    if (typeof updateStatusMsg === 'function') updateStatusMsg(data);
  }

  async function handleUploadBio(params) {
    if (typeof uploadBio === 'function') {
      const data = await uploadBio({
        ...params,
        profileId: profile.id
      });
      onUpdateBio(data);
      setBioEditModalShown(false);
    }
  }
}
