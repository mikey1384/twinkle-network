import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Comments from 'components/Comments';
import StatusMsg from 'components/UserDetails/StatusMsg';
import StatusInput from 'components/UserDetails/StatusInput';
import RankBar from 'components/RankBar';
import request from 'axios';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ConfirmModal from 'components/Modals/ConfirmModal';
import BioEditModal from 'components/Modals/BioEditModal';
import DropDownButton from 'components/Buttons/DropdownButton';
import { css } from 'emotion';
import {
  removeStatusMsg,
  updateStatusMsg,
  setGreeting,
  uploadBio
} from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { auth, loadComments, uploadGreeting } from 'helpers/requestHelpers';
import {
  addEmoji,
  finalizeEmoji,
  renderText,
  stringIsEmpty
} from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import URL from 'constants/URL';
import Bio from 'components/Texts/Bio';
import BasicInfos from './BasicInfos';
import Achievements from './Achievements';
import { Context } from 'context';

Home.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    emailVerified: PropTypes.bool,
    id: PropTypes.number,
    joinDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    greeting: PropTypes.string,
    lastActive: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    online: PropTypes.number,
    profileFirstRow: PropTypes.string,
    profileSecondRow: PropTypes.string,
    profileThirdRow: PropTypes.string,
    profileTheme: PropTypes.string,
    rank: PropTypes.number,
    statusColor: PropTypes.string,
    statusMsg: PropTypes.string,
    twinkleXP: PropTypes.number,
    username: PropTypes.string.isRequired,
    website: PropTypes.string,
    youtubeName: PropTypes.string,
    youtubeUrl: PropTypes.string
  }).isRequired,
  reduxDispatch: PropTypes.func.isRequired,
  removeStatusMsg: PropTypes.func.isRequired,
  selectedTheme: PropTypes.string.isRequired,
  setGreeting: PropTypes.func.isRequired,
  updateStatusMsg: PropTypes.func.isRequired,
  uploadBio: PropTypes.func.isRequired,
  userId: PropTypes.number
};

function Home({
  reduxDispatch,
  profile,
  profile: {
    email,
    emailVerified,
    greeting,
    id,
    joinDate,
    lastActive,
    online,
    statusMsg,
    profileFirstRow,
    profileSecondRow,
    profileTheme,
    profileThirdRow,
    statusColor,
    username,
    website,
    youtubeName,
    youtubeUrl
  },
  removeStatusMsg,
  selectedTheme,
  setGreeting,
  updateStatusMsg,
  uploadBio,
  userId
}) {
  const [bioEditModalShown, setBioEditModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [editedStatusColor, setEditedStatusColor] = useState(statusColor);
  const [editedStatusMsg, setEditedStatusMsg] = useState('');
  const mounted = useRef(true);
  const CommentInputAreaRef = useRef(null);
  const StatusInputRef = useRef(null);
  const {
    content: {
      state,
      actions: {
        onAttachStar,
        onDeleteComment,
        onEditComment,
        onEditRewardComment,
        onInitContent,
        onLikeComment,
        onLoadComments,
        onLoadMoreComments,
        onLoadMoreReplies,
        onLoadRepliesOfReply,
        onUploadComment,
        onUploadReply
      }
    }
  } = useContext(Context);

  useEffect(() => {
    mounted.current = true;
    initComments();
    async function initComments() {
      try {
        const { comments, loadMoreButton } = await loadComments({
          contentId: id,
          contentType: 'user',
          limit: 5
        });
        if (mounted.current) {
          onInitContent({
            contentId: profile.id,
            contentType: 'user',
            childComments: comments,
            commentsLoadMoreButton: loadMoreButton
          });
          setEditedStatusColor(statusColor);
        }
      } catch (error) {
        console.error(error);
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
  }, [id]);

  const bioExists = profileFirstRow || profileSecondRow || profileThirdRow;
  const usernameColor = Color[selectedTheme]();
  let defaultMessage = `<p>Welcome to <b style="color: ${usernameColor}">${username}</b>'s Profile Page</p>`;
  const contentState = state['user' + profile.id] || {
    contentId: profile.id,
    contentType: 'user'
  };
  const { childComments = [], commentsLoadMoreButton = false } = contentState;

  return (
    <div
      className={css`
        width: 70vw;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100vw;
        }
      `}
    >
      <SectionPanel
        loaded
        customColorTheme={selectedTheme}
        title={greeting || 'Welcome!'}
        canEdit={id === userId}
        placeholder="Enter a message for your visitors"
        onEditTitle={handleEditGreeting}
      >
        <div
          style={{
            display: 'flex',
            minHeight: '10rem',
            width: '100%',
            marginTop: userId !== profile.id ? '-1.5rem' : 0
          }}
        >
          <div
            style={{
              width: 'CALC(50% - 1rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginRight: '1rem'
            }}
          >
            <div
              style={{
                width: '90%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              {userId === profile.id && (
                <StatusInput
                  innerRef={StatusInputRef}
                  profile={profile}
                  statusColor={editedStatusColor || statusColor}
                  editedStatusMsg={editedStatusMsg}
                  setColor={color => setEditedStatusColor(color)}
                  onTextChange={event => {
                    setEditedStatusMsg(
                      addEmoji(renderText(event.target.value))
                    );
                    if (!event.target.value) {
                      setEditedStatusColor('');
                    }
                  }}
                  onCancel={() => {
                    setEditedStatusMsg('');
                    setEditedStatusColor('');
                  }}
                  onStatusSubmit={handleStatusMsgSubmit}
                />
              )}
              {(!stringIsEmpty(statusMsg) || editedStatusMsg) && (
                <StatusMsg
                  style={{
                    fontSize: '1.6rem',
                    width: '100%',
                    marginTop: profile.twinkleXP > 0 || bioExists ? '1rem' : 0,
                    marginBottom:
                      profile.twinkleXP > 0 || bioExists ? '2rem' : 0
                  }}
                  statusColor={editedStatusColor || statusColor || 'logoBlue'}
                  statusMsg={editedStatusMsg || statusMsg}
                />
              )}
              {userId === profile.id &&
                !editedStatusMsg &&
                !stringIsEmpty(statusMsg) && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '-1rem',
                      marginBottom:
                        profile.twinkleXP > 0 || bioExists ? '1rem' : 0
                    }}
                  >
                    <Button
                      transparent
                      onClick={() => {
                        setEditedStatusMsg(statusMsg);
                        StatusInputRef.current.focus();
                      }}
                    >
                      <Icon icon="pencil-alt" />
                      <span style={{ marginLeft: '0.7rem' }}>Edit</span>
                    </Button>
                    <Button
                      transparent
                      style={{ marginLeft: '0.5rem' }}
                      onClick={() => setConfirmModalShown(true)}
                    >
                      <Icon icon="trash-alt" />
                      <span style={{ marginLeft: '0.7rem' }}>Remove</span>
                    </Button>
                  </div>
                )}
              {userId !== profile.id && stringIsEmpty(statusMsg) && (
                <div
                  style={{
                    marginTop: '-1rem',
                    width: '100%',
                    fontSize: '2rem',
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center'
                  }}
                  dangerouslySetInnerHTML={{ __html: defaultMessage }}
                />
              )}
            </div>
          </div>
          <BasicInfos
            profileTheme={profileTheme}
            className={css`
              margin-top: ${(!greeting || greeting.length) < 50
                ? userId === profile.id
                  ? '-7rem'
                  : '-4rem'
                : 0};
              @media (max-width: ${mobileMaxWidth}) {
                margin-top: ${(!greeting || greeting.length) < 20
                  ? userId === profile.id
                    ? '-7rem'
                    : '-4rem'
                  : 0};
              }
            `}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              width: 'CALC(50% - 1rem)',
              fontSize: '1.7rem',
              marginLeft: '1rem',
              marginBottom: '1rem'
            }}
            email={email}
            emailVerified={emailVerified}
            joinDate={joinDate}
            online={online}
            lastActive={lastActive}
            myId={userId}
            userId={id}
            username={username}
            selectedTheme={selectedTheme}
            website={website}
            youtubeName={youtubeName}
            youtubeUrl={youtubeUrl}
          />
        </div>
        {profile.twinkleXP > 0 && (
          <RankBar
            profile={profile}
            className={css`
              margin-left: ${!!profile.rank && profile.rank < 4
                ? '-11px'
                : '-10px'};
              margin-right: ${!!profile.rank && profile.rank < 4
                ? '-11px'
                : '-10px'};
              @media (max-width: ${mobileMaxWidth}) {
                margin-left: -1rem !important;
                margin-right: -1rem !important;
              }
            `}
            style={{
              display: 'block',
              borderRadius: 0,
              borderRight: 0,
              borderLeft: 0
            }}
          />
        )}
        {!profile.twinkleXP && bioExists && (
          <hr
            style={{
              padding: '1px',
              background: '#fff',
              borderTop: `2px solid ${Color[selectedTheme || 'logoBlue'](0.6)}`,
              borderBottom: `2px solid ${Color[selectedTheme || 'logoBlue'](
                0.6
              )}`
            }}
          />
        )}
        {bioExists && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {userId === profile.id && (
              <DropDownButton
                direction="left"
                opacity={0.7}
                style={{ right: 0, top: '1rem', position: 'absolute' }}
                skeuomorphic
                color="darkerGray"
                menuProps={[
                  {
                    label: 'Edit',
                    onClick: () => setBioEditModalShown(true)
                  },
                  {
                    label: 'Remove',
                    onClick: () =>
                      uploadBio({
                        firstLine: '',
                        secondLine: '',
                        thirdLine: ''
                      })
                  }
                ]}
              />
            )}
            <Bio
              style={{ fontSize: '1.6rem', marginBottom: '1rem' }}
              firstRow={profileFirstRow}
              secondRow={profileSecondRow}
              thirdRow={profileThirdRow}
            />
          </div>
        )}
        {!bioExists && profile.id === userId && (
          <div
            style={{
              width: '100%',
              justifyContent: 'center',
              display: 'flex',
              marginTop: '1rem'
            }}
          >
            <Button
              style={{ fontSize: '2rem' }}
              transparent
              onClick={() => setBioEditModalShown(true)}
            >
              Add a Bio
            </Button>
          </div>
        )}
      </SectionPanel>
      <Achievements
        selectedTheme={selectedTheme}
        profile={profile}
        myId={userId}
      />
      {confirmModalShown && (
        <ConfirmModal
          onConfirm={handleRemoveStatus}
          onHide={() => setConfirmModalShown(false)}
          title={`Remove Status Message`}
        />
      )}
      {(userId !== profile.id || childComments.length > 0) && (
        <SectionPanel
          customColorTheme={selectedTheme}
          loaded
          title="Message Board"
        >
          <Comments
            comments={childComments}
            commentsLoadLimit={20}
            commentsShown={true}
            contentId={id}
            inputAreaInnerRef={CommentInputAreaRef}
            inputTypeLabel={`message to ${username}`}
            loadMoreButton={commentsLoadMoreButton}
            noInput={id === userId}
            numPreviews={1}
            onAttachStar={onAttachStar}
            onCommentSubmit={onUploadComment}
            onDelete={onDeleteComment}
            onEditDone={onEditComment}
            onLikeClick={onLikeComment}
            onLoadMoreComments={onLoadMoreComments}
            onLoadMoreReplies={onLoadMoreReplies}
            onLoadRepliesOfReply={onLoadRepliesOfReply}
            onPreviewClick={onLoadComments}
            onReplySubmit={onUploadReply}
            onRewardCommentEdit={onEditRewardComment}
            parent={{ ...profile, contentType: 'user' }}
            userId={userId}
          />
        </SectionPanel>
      )}
      {bioEditModalShown && (
        <BioEditModal
          firstLine={profileFirstRow}
          secondLine={profileSecondRow}
          thirdLine={profileThirdRow}
          onSubmit={handleUploadBio}
          onHide={() => setBioEditModalShown(false)}
        />
      )}
    </div>
  );

  async function handleEditGreeting(greeting) {
    await uploadGreeting({ greeting, dispatch: reduxDispatch });
    setGreeting(greeting);
  }

  async function handleUploadBio(params) {
    await uploadBio({ ...params, profileId: profile.id });
    setBioEditModalShown(false);
  }

  async function handleRemoveStatus() {
    await request.delete(`${URL}/user/statusMsg`, auth());
    removeStatusMsg(userId);
    setConfirmModalShown(false);
  }

  async function handleStatusMsgSubmit() {
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
}

export default connect(
  state => ({ userId: state.UserReducer.userId }),
  dispatch => ({
    reduxDispatch: dispatch,
    uploadBio: params => dispatch(uploadBio(params)),
    removeStatusMsg: userId => dispatch(removeStatusMsg(userId)),
    setGreeting: greeting => dispatch(setGreeting(greeting)),
    updateStatusMsg: data => dispatch(updateStatusMsg(data))
  })
)(Home);
