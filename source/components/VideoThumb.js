import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from './Buttons/DropdownButton';
import EditTitleForm from './Texts/EditTitleForm';
import ConfirmModal from './Modals/ConfirmModal';
import UsernameText from './Texts/UsernameText';
import Link from 'components/Link';
import FullTextReveal from 'components/Texts/FullTextReveal';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import VideoThumbImage from 'components/VideoThumbImage';
import Icon from 'components/Icon';
import { cleanString } from 'helpers/stringHelpers';
import { textIsOverflown } from 'helpers';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { charLimit } from 'constants/defaultValues';
import { editVideoTitle, deleteVideo } from 'redux/actions/VideoActions';
import { connect } from 'react-redux';

VideoThumb.propTypes = {
  arrayIndex: PropTypes.number,
  className: PropTypes.string,
  clickSafe: PropTypes.bool,
  deletable: PropTypes.bool,
  deleteVideo: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  editVideoTitle: PropTypes.func,
  lastVideoId: PropTypes.number,
  style: PropTypes.object,
  to: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  video: PropTypes.shape({
    byUser: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    content: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    difficulty: PropTypes.number,
    likes: PropTypes.array,
    title: PropTypes.string.isRequired
  }).isRequired
};

function VideoThumb({
  arrayIndex,
  className,
  clickSafe,
  deletable,
  deleteVideo,
  editable,
  editVideoTitle,
  lastVideoId,
  style,
  to,
  user,
  video
}) {
  const [onEdit, setOnEdit] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [onTitleHover, setOnTitleHover] = useState(false);
  const ThumbLabelRef = useRef(null);
  const menuProps = [];
  if (editable) {
    menuProps.push({
      label: 'Edit',
      onClick: onEditTitle
    });
  }
  if (deletable || editable) {
    menuProps.push({
      label: 'Remove',
      onClick: onDeleteClick
    });
  }
  return (
    <ErrorBoundary style={style}>
      <div
        className={`${className} ${css`
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: flex-end;
          position: relative;
          font-size: 1.5rem;
          box-shadow: 0 0 5px ${Color.darkerGray()};
          background: ${Color.whiteGray()};
          border-radius: 1px;
          p {
            font-weight: bold;
          }
        `}`}
      >
        {(deletable || editable) && (
          <DropdownButton
            style={{
              position: 'absolute',
              zIndex: '1'
            }}
            direction="left"
            snow
            noBorderRadius
            menuProps={menuProps}
          />
        )}
        <div style={{ width: '100%' }}>
          <Link to={`/${to}`} onClickAsync={onLinkClick}>
            <VideoThumbImage
              height="65%"
              videoId={video.id}
              difficulty={video.difficulty}
              src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
            />
          </Link>
        </div>
        <div
          style={{
            height: '8rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '0 1rem'
          }}
        >
          {onEdit ? (
            <div
              style={{
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem'
              }}
            >
              <EditTitleForm
                autoFocus
                inputStyle={{ fontSize: '1.3rem' }}
                maxLength={charLimit.video.title}
                title={video.title}
                onEditSubmit={onEditedTitleSubmit}
                onClickOutSide={onEditTitleCancel}
              />
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <p
                ref={ThumbLabelRef}
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  lineHeight: 'normal'
                }}
              >
                <a
                  style={{
                    color: video.byUser ? Color.brown() : Color.blue()
                  }}
                  href={`/${to}`}
                  onClick={onLinkClick}
                  onMouseOver={onMouseOver}
                  onMouseLeave={() => setOnTitleHover(false)}
                >
                  {cleanString(video.title)}
                </a>
              </p>
              <FullTextReveal
                show={onTitleHover}
                text={cleanString(video.title)}
              />
            </div>
          )}
          <div style={{ width: '100%', fontSize: '1.2rem' }}>
            {!onEdit && (
              <div className="username">
                Added by <UsernameText user={user} />
              </div>
            )}
            {video.likes?.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <Icon icon="thumbs-up" />
                &nbsp;&times;&nbsp;
                {video.likes.length}
              </div>
            )}
          </div>
        </div>
      </div>
      {confirmModalShown && (
        <ConfirmModal
          title="Remove Video"
          onHide={onHideModal}
          onConfirm={onDeleteConfirm}
        />
      )}
    </ErrorBoundary>
  );

  function onLinkClick() {
    return Promise.resolve(clickSafe);
  }

  function onEditTitle() {
    setOnEdit(true);
  }

  async function onEditedTitleSubmit(title) {
    const videoId = video.id;
    await editVideoTitle({ title, videoId });
    setOnEdit(false);
  }

  function onEditTitleCancel() {
    setOnEdit(false);
  }

  function onDeleteClick() {
    setConfirmModalShown(true);
  }

  function onDeleteConfirm() {
    const videoId = video.id;
    deleteVideo({ videoId, arrayIndex, lastVideoId });
  }

  function onHideModal() {
    setConfirmModalShown(false);
  }

  function onMouseOver() {
    if (textIsOverflown(ThumbLabelRef.current)) {
      setOnTitleHover(true);
    }
  }
}

export default connect(
  state => ({ userId: state.UserReducer.userId }),
  {
    editVideoTitle,
    deleteVideo
  }
)(VideoThumb);
