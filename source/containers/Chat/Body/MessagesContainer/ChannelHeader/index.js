import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Loading from 'components/Loading';
import FullTextReveal from 'components/Texts/FullTextReveal';
import UsernameText from 'components/Texts/UsernameText';
import EditSubjectForm from './EditSubjectForm';
import ErrorBoundary from 'components/ErrorBoundary';
import DropdownButton from 'components/Buttons/DropdownButton';
import Icon from 'components/Icon';
import { isMobile, textIsOverflown } from 'helpers';
import { timeSince } from 'helpers/timeStampHelpers';
import { socket } from 'constants/io';
import {
  charLimit,
  defaultChatSubject,
  GENERAL_CHAT_ID
} from 'constants/defaultValues';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useInterval, useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

ChannelHeader.propTypes = {
  currentChannel: PropTypes.object.isRequired,
  onInputFocus: PropTypes.func.isRequired,
  onSetInviteUsersModalShown: PropTypes.func,
  onSetLeaveConfirmModalShown: PropTypes.func,
  onSetSettingsModalShown: PropTypes.func,
  selectedChannelId: PropTypes.number
};

export default function ChannelHeader({
  currentChannel,
  onInputFocus,
  onSetInviteUsersModalShown,
  onSetLeaveConfirmModalShown,
  onSetSettingsModalShown,
  selectedChannelId
}) {
  const {
    requestHelpers: {
      loadChatSubject,
      reloadChatSubject,
      searchChatSubject,
      uploadChatSubject
    }
  } = useAppContext();
  const { authLevel, profilePicId, userId, username } = useMyState();
  const {
    state: { subjectObj, subjectSearchResults },
    actions: {
      onClearSubjectSearchResults,
      onLoadChatSubject,
      onReloadChatSubject,
      onSearchChatSubject,
      onSetIsRespondingToSubject,
      onUploadChatSubject
    }
  } = useChatContext();
  const [onEdit, setOnEdit] = useState(false);
  const [onHover, setOnHover] = useState(false);

  const {
    content = defaultChatSubject,
    id: subjectId,
    loaded,
    uploader = {},
    reloader = {},
    timeStamp,
    reloadTimeStamp
  } = subjectObj[selectedChannelId] || {};

  const [timeSincePost, setTimeSincePost] = useState(timeSince(timeStamp));
  const [timeSinceReload, setTimeSinceReload] = useState(
    timeSince(reloadTimeStamp)
  );
  const HeaderLabelRef = useRef(null);

  useEffect(() => {
    if (!loaded) {
      handleInitialLoad();
    }
    async function handleInitialLoad() {
      const data = await loadChatSubject(selectedChannelId);
      onLoadChatSubject(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannelId]);

  useEffect(() => {
    setTimeSincePost(timeSince(timeStamp));
    setTimeSinceReload(timeSince(reloadTimeStamp));
  }, [timeStamp, reloadTimeStamp]);

  useInterval(() => {
    setTimeSincePost(timeSince(timeStamp));
    setTimeSinceReload(timeSince(reloadTimeStamp));
  }, 1000);

  const subjectDetails = useMemo(() => {
    const isReloaded = reloader && reloader.id;
    let posterString = '';
    if (uploader.id && timeSincePost) {
      posterString = (
        <span>
          Started by <UsernameText user={uploader} />{' '}
          <span className="desktop">{timeSincePost}</span>
        </span>
      );
    }
    if (isReloaded && timeSinceReload) {
      posterString = (
        <span>
          Brought back by <UsernameText user={reloader} />{' '}
          <span className="desktop">{timeSinceReload}</span>{' '}
          <span className="desktop">
            (started by {<UsernameText user={uploader} />})
          </span>
        </span>
      );
    }
    return <small>{posterString}</small>;
  }, [reloader, timeSincePost, timeSinceReload, uploader]);

  const menuProps = useMemo(() => {
    let result = [];
    if (
      currentChannel.canChangeSubject === 'all' ||
      (currentChannel.canChangeSubject === 'owner' &&
        currentChannel.creatorId === userId)
    ) {
      result.push({
        label: (
          <>
            <Icon icon="exchange-alt" />
            <span style={{ marginLeft: '1rem' }}>Change Subject</span>
          </>
        ),
        onClick: () => setOnEdit(true)
      });
    }
    if (currentChannel.id !== GENERAL_CHAT_ID) {
      if (!currentChannel.isClosed || currentChannel.creatorId === userId) {
        result.push({
          label: (
            <>
              <Icon icon="users" />
              <span style={{ marginLeft: '1rem' }}>Invite People</span>
            </>
          ),
          onClick: () => onSetInviteUsersModalShown(true)
        });
      }
      result.push({
        label:
          currentChannel.creatorId === userId ? (
            <>
              <Icon icon="sliders-h" />
              <span style={{ marginLeft: '1rem' }}>Settings</span>
            </>
          ) : (
            <>
              <Icon icon="pencil-alt" />
              <span style={{ marginLeft: '1rem' }}>Edit Group Name</span>
            </>
          ),
        onClick: () => onSetSettingsModalShown(true)
      });
      result.push({
        separator: true
      });
      result.push({
        label: (
          <>
            <Icon icon="sign-out-alt" />
            <span style={{ marginLeft: '1rem' }}>Leave</span>
          </>
        ),
        onClick: () => onSetLeaveConfirmModalShown(true)
      });
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentChannel.twoPeople,
    currentChannel.isClosed,
    currentChannel.creatorId,
    userId
  ]);

  const menuButtonShown = useMemo(() => {
    return (
      (currentChannel.id !== GENERAL_CHAT_ID || authLevel > 0) &&
      menuProps.length > 0
    );
  }, [authLevel, currentChannel.id, menuProps.length]);

  return (
    <ErrorBoundary
      className={css`
        position: relative;
        width: 100%;
        height: 100%;
        padding: 1rem;
        height: 7rem;
        align-items: center;
        display: flex;
        align-items: center;
        > section {
          position: relative;
          display: flex;
          align-items: center;
          flex-direction: column;
          width: CALC(100% - ${authLevel > 0 ? '22rem' : '12rem'});
          @media (max-width: ${mobileMaxWidth}) {
            width: CALC(100% - ${authLevel > 0 ? '13rem' : '3rem'});
          }
        }
      `}
    >
      {loaded ? (
        <>
          {!onEdit && (
            <>
              <section>
                <div style={{ width: '100%' }}>
                  <span
                    className={css`
                      width: 100%;
                      cursor: default;
                      color: ${Color.green()};
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      line-height: normal;
                      font-size: 2.2rem;
                      font-weight: bold;
                      display: block;
                      @media (max-width: ${mobileMaxWidth}) {
                        font-size: 1.6rem;
                      }
                    `}
                    onClick={() =>
                      setOnHover(
                        textIsOverflown(HeaderLabelRef.current)
                          ? !onHover
                          : false
                      )
                    }
                    onMouseOver={handleMouseOver}
                    onMouseLeave={() => setOnHover(false)}
                    ref={HeaderLabelRef}
                  >
                    {content}
                  </span>
                  <FullTextReveal text={content} show={onHover} />
                </div>
                <div style={{ width: '100%' }}>{subjectDetails}</div>
              </section>
              <div
                className={css`
                  position: absolute;
                  height: 100%;
                  font-size: 1.3rem;
                  right: 1rem;
                  display: flex;
                  align-items: center;
                  @media (max-width: ${mobileMaxWidth}) {
                    font-size: 1.2rem;
                  }
                `}
              >
                <Button
                  color="green"
                  filled
                  onClick={() => {
                    onSetIsRespondingToSubject(true);
                    onInputFocus();
                  }}
                >
                  <Icon flip="both" icon="reply" />
                  <span className="desktop" style={{ marginLeft: '0.5rem' }}>
                    Respond
                  </span>
                </Button>
                {menuButtonShown && (
                  <DropdownButton
                    skeuomorphic
                    color="darkerGray"
                    opacity={0.7}
                    style={{
                      marginLeft: '1rem'
                    }}
                    listStyle={{
                      width: '15rem'
                    }}
                    direction="left"
                    icon="bars"
                    text="Menu"
                    menuProps={menuProps}
                  />
                )}
              </div>
            </>
          )}
          {onEdit && (
            <EditSubjectForm
              autoFocus
              channelId={selectedChannelId}
              maxLength={charLimit.chat.subject}
              currentSubjectId={subjectId}
              title={content}
              onEditSubmit={onSubjectSubmit}
              onChange={handleSearchChatSubject}
              onClickOutSide={() => {
                setOnEdit(false);
                onClearSubjectSearchResults();
              }}
              onReloadChatSubject={handleReloadChatSubject}
              searchResults={subjectSearchResults}
            />
          )}
        </>
      ) : (
        <Loading
          style={{
            color: Color.green()
          }}
          text="Loading Subject..."
        />
      )}
    </ErrorBoundary>
  );

  function handleMouseOver() {
    if (textIsOverflown(HeaderLabelRef.current) && !isMobile(navigator)) {
      setOnHover(true);
    }
  }

  async function handleReloadChatSubject(subjectId) {
    const { message, subject } = await reloadChatSubject({
      channelId: selectedChannelId,
      subjectId
    });
    onReloadChatSubject({ channelId: selectedChannelId, message, subject });
    socket.emit('new_subject', { subject, message });
    setOnEdit(false);
    onClearSubjectSearchResults();
    if (!isMobile(navigator)) {
      onInputFocus();
    }
  }

  async function handleSearchChatSubject(text) {
    const data = await searchChatSubject({
      text,
      channelId: selectedChannelId
    });
    onSearchChatSubject(data);
  }

  async function onSubjectSubmit(text) {
    const content = `${text[0].toUpperCase()}${text.slice(1)}`;
    const data = await uploadChatSubject({
      content: text,
      channelId: selectedChannelId
    });
    onUploadChatSubject({ ...data, channelId: selectedChannelId });
    const timeStamp = Math.floor(Date.now() / 1000);
    const subject = {
      id: data.subjectId,
      userId,
      username,
      reloadedBy: null,
      reloaderName: null,
      uploader: { id: userId, username },
      content,
      timeStamp
    };
    const message = {
      profilePicId,
      userId,
      username,
      content,
      isSubject: true,
      channelId: 2,
      timeStamp,
      isNewMessage: true
    };
    socket.emit('new_subject', { subject, message });
    setOnEdit(false);
    if (!isMobile(navigator)) {
      onInputFocus();
    }
  }
}
