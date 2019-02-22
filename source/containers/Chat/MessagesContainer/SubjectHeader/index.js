import React, { useEffect, useRef, useState } from 'react';
import { useInterval } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Loading from 'components/Loading';
import FullTextReveal from 'components/Texts/FullTextReveal';
import UsernameText from 'components/Texts/UsernameText';
import EditSubjectForm from './EditSubjectForm';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { cleanString } from 'helpers/stringHelpers';
import { connect } from 'react-redux';
import {
  clearSubjectSearchResults,
  loadChatSubject,
  reloadChatSubject,
  uploadChatSubject,
  changeChatSubject,
  searchChatSubject
} from 'redux/actions/ChatActions';
import { textIsOverflown } from 'helpers';
import { timeSince } from 'helpers/timeStampHelpers';
import { socket } from 'constants/io';
import { charLimit, defaultChatSubject } from 'constants/defaultValues';
import { Color } from 'constants/css';
import { css } from 'emotion';

SubjectHeader.propTypes = {
  clearSubjectSearchResults: PropTypes.func,
  userId: PropTypes.number,
  username: PropTypes.string,
  profilePicId: PropTypes.number,
  subject: PropTypes.object,
  changeChatSubject: PropTypes.func,
  loadChatSubject: PropTypes.func,
  reloadChatSubject: PropTypes.func,
  searchChatSubject: PropTypes.func,
  subjectSearchResults: PropTypes.array,
  uploadChatSubject: PropTypes.func
};

function SubjectHeader({
  changeChatSubject,
  clearSubjectSearchResults,
  loadChatSubject,
  profilePicId,
  reloadChatSubject,
  subject: {
    content = defaultChatSubject,
    id: subjectId,
    uploader = {},
    reloader = {},
    timeStamp,
    reloadTimeStamp
  },
  searchChatSubject,
  subjectSearchResults,
  uploadChatSubject,
  userId,
  username
}) {
  const [loaded, setLoaded] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const [timeSincePost, setTimeSincePost] = useState(timeSince(timeStamp));
  const [timeSinceReload, setTimeSinceReload] = useState(
    timeSince(reloadTimeStamp)
  );
  const HeaderLabelRef = useRef(null);
  const mounted = useRef(true);
  const subjectTitle = cleanString(content);

  useEffect(() => {
    socket.on('subject_change', onSubjectChange);
    if (!loaded) {
      initialLoad();
    }
    async function initialLoad() {
      await loadChatSubject();
      if (mounted.current) {
        setLoaded(true);
      }
    }
    return function cleanUp() {
      mounted.current = false;
      socket.removeListener('subject_change', onSubjectChange);
    };
  });

  useEffect(() => {
    setTimeSincePost(timeSince(timeStamp));
    setTimeSinceReload(timeSince(reloadTimeStamp));
  }, [timeStamp, reloadTimeStamp]);

  useInterval(
    () => {
      setTimeSincePost(timeSince(timeStamp));
      setTimeSinceReload(timeSince(reloadTimeStamp));
    },
    1000,
    [timeStamp, reloadTimeStamp]
  );

  return (
    <ErrorBoundary
      className={css`
        display: flex;
        position: relative;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 7rem;
        > section {
          position: relative;
          width: CALC(100% - 15rem);
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
                    style={{
                      cursor: 'default',
                      color: Color.green(),
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      lineHeight: 'normal',
                      fontSize: '2.2rem',
                      fontWeight: 'bold',
                      display: 'block'
                    }}
                    onClick={() =>
                      setOnHover(
                        textIsOverflown(HeaderLabelRef.current)
                          ? !onHover
                          : false
                      )
                    }
                    onMouseOver={onMouseOver}
                    onMouseLeave={() => setOnHover(false)}
                    ref={HeaderLabelRef}
                  >
                    {subjectTitle}
                  </span>
                  <FullTextReveal text={subjectTitle} show={onHover} />
                </div>
                {renderDetails()}
              </section>
              <Button
                filled
                logo
                style={{
                  position: 'absolute',
                  fontSize: '1.3rem',
                  right: '1rem'
                }}
                onClick={() => setOnEdit(true)}
              >
                Change Subject
              </Button>
            </>
          )}
          {onEdit && (
            <EditSubjectForm
              autoFocus
              maxLength={charLimit.chat.subject}
              currentSubjectId={subjectId}
              title={subjectTitle}
              onEditSubmit={onSubjectSubmit}
              onChange={text => searchChatSubject(text)}
              onClickOutSide={() => {
                setOnEdit(false);
                clearSubjectSearchResults();
              }}
              reloadChatSubject={onReloadChatSubject}
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

  function onMouseOver() {
    if (textIsOverflown(HeaderLabelRef.current)) {
      setOnHover(true);
    }
  }

  function onSubjectChange({ subject }) {
    changeChatSubject(subject);
  }

  async function onReloadChatSubject(subjectId) {
    const { message, subject } = await reloadChatSubject(subjectId);
    socket.emit('new_subject', { subject, message });
    setOnEdit(false);
    clearSubjectSearchResults();
  }

  async function onSubjectSubmit(text) {
    const content = `${text[0].toUpperCase()}${text.slice(1)}`;
    const subjectId = await uploadChatSubject(text);
    const timeStamp = Math.floor(Date.now() / 1000);
    const subject = {
      id: subjectId,
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
      timeStamp
    };
    socket.emit('new_subject', { subject, message });
    setOnEdit(false);
  }

  function renderDetails() {
    const isReloaded = reloader && reloader.id;
    let posterString =
      'You can change this subject by clicking the blue "Change Subject" button';
    if (uploader.id) {
      posterString = (
        <span>
          Started by <UsernameText user={uploader} /> {timeSincePost}
        </span>
      );
    }
    if (isReloaded) {
      posterString = (
        <span>
          Brought back by <UsernameText user={reloader} /> {timeSinceReload}{' '}
          (started by {<UsernameText user={uploader} />})
        </span>
      );
    }
    return (
      <>
        {uploader ? (
          <small>{posterString}</small>
        ) : (
          <small>
            {
              'You can change the subject by clicking the "Change Subject" button on the right'
            }
          </small>
        )}
      </>
    );
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId,
    subject: state.ChatReducer.subject,
    subjectSearchResults: state.ChatReducer.subjectSearchResults
  }),
  {
    clearSubjectSearchResults,
    changeChatSubject,
    loadChatSubject,
    reloadChatSubject,
    uploadChatSubject,
    searchChatSubject
  }
)(SubjectHeader);
