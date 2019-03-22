import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/Buttons/DropdownButton';
import Button from 'components/Button';
import { determineXpButtonDisabled, textIsOverflown } from 'helpers';
import Icon from 'components/Icon';
import XPRewardInterface from 'components/XPRewardInterface';
import AlreadyPosted from 'components/AlreadyPosted';
import {
  addEmoji,
  cleanString,
  exceedsCharLimit,
  stringIsEmpty,
  finalizeEmoji,
  isValidYoutubeUrl
} from 'helpers/stringHelpers';
import BasicInfos from './BasicInfos';
import SideButtons from './SideButtons';
import Description from './Description';
import TagStatus from 'components/TagStatus';
import { connect } from 'react-redux';
import { Color } from 'constants/css';

Details.propTypes = {
  addTags: PropTypes.func.isRequired,
  attachStar: PropTypes.func.isRequired,
  authLevel: PropTypes.number,
  changeByUserStatus: PropTypes.func.isRequired,
  byUser: PropTypes.bool,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  canStar: PropTypes.bool,
  changingPage: PropTypes.bool,
  content: PropTypes.string.isRequired,
  description: PropTypes.string,
  difficulty: PropTypes.number,
  likes: PropTypes.array.isRequired,
  likeVideo: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditCancel: PropTypes.func.isRequired,
  onEditFinish: PropTypes.func.isRequired,
  onEditStart: PropTypes.func.isRequired,
  setDifficulty: PropTypes.func.isRequired,
  tags: PropTypes.array,
  stars: PropTypes.array,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string.isRequired,
  uploader: PropTypes.object.isRequired,
  userId: PropTypes.number,
  videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  videoViews: PropTypes.number.isRequired
};

function Details({
  addTags,
  attachStar,
  authLevel,
  byUser,
  canDelete,
  canEdit,
  canStar,
  changeByUserStatus,
  changingPage,
  content,
  difficulty,
  likeVideo,
  userId,
  uploader,
  title,
  description,
  likes,
  onDelete,
  onEditCancel,
  onEditStart,
  onEditFinish,
  tags = [],
  setDifficulty,
  stars,
  timeStamp,
  videoId,
  videoViews
}) {
  const [onEdit, setOnEdit] = useState(false);
  const [titleHovered, setTitleHovered] = useState(false);
  const [editedTitle, setEditedTitle] = useState(cleanString(title));
  const [editedUrl, setEditedUrl] = useState(
    `https://www.youtube.com/watch?v=${content}`
  );
  const [editedDescription, setEditedDescription] = useState(description);
  const [xpRewardInterfaceShown, setXpRewardInterfaceShown] = useState(false);
  const TitleRef = useRef(null);

  useEffect(() => {
    setOnEdit(false);
    setEditedTitle(cleanString(title));
    setEditedUrl(`https://www.youtube.com/watch?v=${content}`);
    setEditedDescription(description);
    setXpRewardInterfaceShown(false);
  }, [title, description, content]);

  const userIsUploader = uploader.id === userId;
  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploader.authLevel;
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: handleEditStart
    });
  }
  if (userIsUploader || canDelete) {
    editMenuItems.push({
      label: 'Delete',
      onClick: onDelete
    });
  }
  return (
    <div style={{ width: '100%' }}>
      <AlreadyPosted
        changingPage={changingPage}
        style={{ marginBottom: '1rem' }}
        contentId={Number(videoId)}
        type="video"
        url={content}
        uploaderId={uploader.id}
        videoCode={content}
      />
      <TagStatus
        style={{ fontSize: '1.5rem' }}
        onAddTags={addTags}
        tags={tags}
        contentId={Number(videoId)}
      />
      <div style={{ padding: '0 1rem 1rem 1rem', width: '100%' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              background: '#fff',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '1.5rem'
            }}
          >
            <BasicInfos
              style={{
                marginRight: '1rem',
                width: '75%',
                display: 'flex',
                flexDirection: 'column'
              }}
              editedUrl={editedUrl}
              editedTitle={editedTitle}
              onTitleChange={setEditedTitle}
              innerRef={TitleRef}
              onTitleKeyUp={event => {
                if (event.key === ' ') {
                  setEditedTitle(addEmoji(event.target.value));
                }
              }}
              onUrlChange={text => {
                setEditedUrl(text);
              }}
              onEdit={onEdit}
              onMouseLeave={() => setTitleHovered(false)}
              onMouseOver={onMouseOver}
              onTitleHover={() => {
                if (textIsOverflown(TitleRef.current)) {
                  setTitleHovered(!titleHovered);
                }
              }}
              title={title}
              titleExceedsCharLimit={titleExceedsCharLimit}
              titleHovered={titleHovered}
              timeStamp={timeStamp}
              uploader={uploader}
              urlExceedsCharLimit={urlExceedsCharLimit}
            />
            <SideButtons
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
              byUser={byUser}
              canStar={canStar}
              changeByUserStatus={changeByUserStatus}
              difficulty={difficulty}
              likes={likes}
              likeVideo={likeVideo}
              setDifficulty={handleSetDifficulty}
              uploader={uploader}
              userId={userId}
              videoId={videoId}
            />
          </div>
        </div>
        <Description
          onChange={event => {
            setEditedDescription(event.target.value);
          }}
          onEdit={onEdit}
          onEditCancel={handleEditCancel}
          onEditFinish={handleEditFinish}
          onKeyUp={event => {
            if (event.key === ' ') {
              setEditedDescription(addEmoji(event.target.value));
            }
          }}
          description={description}
          editedDescription={editedDescription}
          descriptionExceedsCharLimit={descriptionExceedsCharLimit}
          determineEditButtonDoneStatus={determineEditButtonDoneStatus}
        />
        {!onEdit && videoViews > 10 && (
          <div
            style={{
              padding: '1rem 0',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: Color.darkerGray()
            }}
          >
            {videoViews} view
            {`${videoViews > 1 ? 's' : ''}`}
          </div>
        )}
        <div style={{ display: 'flex' }}>
          {editButtonShown && !onEdit && (
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              style={{ marginRight: '1rem' }}
              direction="left"
              text="Edit or Delete This Video"
              menuProps={editMenuItems}
            />
          )}
          {!onEdit && canStar && userCanEditThis && !userIsUploader && (
            <Button
              skeuomorphic
              color="pink"
              disabled={determineXpButtonDisabled({
                difficulty: byUser ? 5 : 0,
                myId: userId,
                xpRewardInterfaceShown,
                stars
              })}
              onClick={() => setXpRewardInterfaceShown(true)}
            >
              <Icon icon="certificate" />
              <span style={{ marginLeft: '0.7rem' }}>
                {determineXpButtonDisabled({
                  difficulty: byUser ? 5 : 0,
                  myId: userId,
                  xpRewardInterfaceShown,
                  stars
                }) || 'Reward'}
              </span>
            </Button>
          )}
        </div>
        {xpRewardInterfaceShown && (
          <XPRewardInterface
            difficulty={byUser ? 5 : 0}
            stars={stars}
            contentType="video"
            contentId={Number(videoId)}
            noPadding
            uploaderId={uploader.id}
            onRewardSubmit={data => {
              setXpRewardInterfaceShown(false);
              attachStar(data);
            }}
          />
        )}
      </div>
    </div>
  );

  function determineEditButtonDoneStatus() {
    const urlIsInvalid = !isValidYoutubeUrl(editedUrl);
    const titleIsEmpty = stringIsEmpty(editedTitle);
    const titleChanged = editedTitle !== title;
    const urlChanged =
      editedUrl !== `https://www.youtube.com/watch?v=${content}`;
    const descriptionChanged = editedDescription !== description;
    if (urlIsInvalid) return true;
    if (titleIsEmpty) return true;
    if (!titleChanged && !descriptionChanged && !urlChanged) return true;
    if (urlExceedsCharLimit(editedUrl)) return true;
    if (titleExceedsCharLimit(editedTitle)) return true;
    if (descriptionExceedsCharLimit(editedDescription)) return true;
    return false;
  }

  function handleEditCancel() {
    onEditCancel();
    setEditedUrl(`https://www.youtube.com/watch?v=${content}`);
    setEditedTitle(cleanString(title));
    setEditedDescription(description);
    setOnEdit(false);
  }

  async function handleEditFinish() {
    const params = {
      url: editedUrl,
      videoId,
      title: finalizeEmoji(editedTitle),
      description: finalizeEmoji(editedDescription)
    };
    await onEditFinish(params);
    setOnEdit(false);
  }

  function handleEditStart() {
    onEditStart();
    setOnEdit(true);
  }

  function onMouseOver() {
    if (textIsOverflown(TitleRef.current)) {
      setTitleHovered(true);
    }
  }

  function handleSetDifficulty(params) {
    setDifficulty(params);
  }

  function descriptionExceedsCharLimit(description) {
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'description',
      text: description
    });
  }

  function titleExceedsCharLimit(title) {
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'title',
      text: title
    });
  }

  function urlExceedsCharLimit(url) {
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'url',
      text: url
    });
  }
}

export default connect(state => ({
  authLevel: state.UserReducer.authLevel,
  canDelete: state.UserReducer.canDelete,
  canEdit: state.UserReducer.canEdit,
  canStar: state.UserReducer.canStar
}))(Details);
