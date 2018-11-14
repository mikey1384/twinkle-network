import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
import {
  addTags,
  attachStar,
  loadTags,
  starVideo
} from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import { Color } from 'constants/css';

class Details extends Component {
  static propTypes = {
    addTags: PropTypes.func.isRequired,
    attachStar: PropTypes.func.isRequired,
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    canStar: PropTypes.bool,
    changingPage: PropTypes.bool,
    content: PropTypes.string.isRequired,
    description: PropTypes.string,
    isStarred: PropTypes.bool,
    likes: PropTypes.array.isRequired,
    likeVideo: PropTypes.func.isRequired,
    loadTags: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditFinish: PropTypes.func.isRequired,
    onEditStart: PropTypes.func.isRequired,
    tags: PropTypes.array,
    stars: PropTypes.array,
    starVideo: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    title: PropTypes.string.isRequired,
    uploaderAuthLevel: PropTypes.number.isRequired,
    uploaderId: PropTypes.number.isRequired,
    uploaderName: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    videoViews: PropTypes.string.isRequired
  };

  constructor({ title, content, description }) {
    super();
    this.state = {
      onEdit: false,
      titleHovered: false,
      editedTitle: cleanString(title),
      editedUrl: `https://www.youtube.com/watch?v=${content}`,
      editedDescription: description,
      xpRewardInterfaceShown: false
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.title !== this.props.title ||
      prevProps.description !== this.props.description ||
      prevProps.content !== this.props.content
    ) {
      return this.setState({
        onEdit: false,
        editedTitle: cleanString(this.props.title),
        editedUrl: `https://www.youtube.com/watch?v=${this.props.content}`,
        editedDescription: this.props.description,
        xpRewardInterfaceShown: false
      });
    }
  }

  render() {
    const {
      addTags,
      attachStar,
      authLevel,
      canDelete,
      canEdit,
      canStar,
      changingPage,
      content,
      isStarred,
      likeVideo,
      uploaderId,
      userId,
      uploaderName,
      title,
      description,
      likes,
      loadTags,
      onDelete,
      tags = [],
      stars,
      starVideo,
      timeStamp,
      uploaderAuthLevel,
      videoId,
      videoViews
    } = this.props;
    let {
      onEdit,
      editedDescription,
      editedTitle,
      editedUrl,
      titleHovered,
      xpRewardInterfaceShown
    } = this.state;
    const userIsUploader = uploaderId === userId;
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel;
    const editButtonShown = userIsUploader || userCanEditThis;
    const editMenuItems = [];
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: this.onEditStart
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
          uploaderId={uploaderId}
          videoCode={content}
        />
        <TagStatus
          style={{ fontSize: '1.5rem' }}
          onAddTags={addTags}
          onLoadTags={loadTags}
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
                onTitleChange={text => {
                  this.setState({ editedTitle: text });
                }}
                innerRef={ref => {
                  this.thumbLabel = ref;
                }}
                onTitleKeyUp={event => {
                  if (event.key === ' ') {
                    this.setState({
                      editedTitle: addEmoji(event.target.value)
                    });
                  }
                }}
                onUrlChange={text => {
                  this.setState({ editedUrl: text });
                }}
                onEdit={onEdit}
                onMouseLeave={() => this.setState({ onTitleHover: false })}
                onMouseOver={this.onMouseOver}
                onTitleHover={() =>
                  this.setState(state => ({
                    onTitleHover: !state.onTitleHover
                  }))
                }
                title={title}
                titleExceedsCharLimit={this.titleExceedsCharLimit}
                titleHovered={titleHovered}
                timeStamp={timeStamp}
                uploaderId={uploaderId}
                uploaderName={uploaderName}
                urlExceedsCharLimit={this.urlExceedsCharLimit}
              />
              <SideButtons
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
                canStar={canStar}
                isStarred={isStarred}
                likes={likes}
                likeVideo={likeVideo}
                starVideo={starVideo}
                userId={userId}
                videoId={videoId}
              />
            </div>
          </div>
          <Description
            onChange={event => {
              this.setState({ editedDescription: event.target.value });
            }}
            onEdit={onEdit}
            onEditCancel={this.onEditCancel}
            onEditFinish={this.onEditFinish}
            onKeyUp={event => {
              if (event.key === ' ') {
                this.setState({
                  editedDescription: addEmoji(event.target.value)
                });
              }
            }}
            description={description}
            editedDescription={editedDescription}
            descriptionExceedsCharLimit={this.descriptionExceedsCharLimit}
            determineEditButtonDoneStatus={this.determineEditButtonDoneStatus}
          />
          {!onEdit &&
            videoViews > 10 && (
              <div
                style={{
                  padding: '1rem 0',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: Color.darkGray()
                }}
              >
                {videoViews} view
                {`${videoViews > 1 ? 's' : ''}`}
              </div>
            )}
          <div style={{ display: 'flex' }}>
            {editButtonShown &&
              !onEdit && (
                <DropdownButton
                  snow
                  style={{ marginRight: '1rem' }}
                  direction="left"
                  text="Edit or Delete This Video"
                  menuProps={editMenuItems}
                />
              )}
            {!onEdit &&
              canStar &&
              userCanEditThis &&
              !userIsUploader && (
                <Button
                  snow
                  disabled={determineXpButtonDisabled({
                    myId: userId,
                    xpRewardInterfaceShown,
                    stars
                  })}
                  style={{
                    color: Color.pink()
                  }}
                  onClick={() =>
                    this.setState({ xpRewardInterfaceShown: true })
                  }
                >
                  <Icon icon="certificate" />
                  <span style={{ marginLeft: '0.7rem' }}>
                    {determineXpButtonDisabled({
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
              stars={stars}
              contentType="video"
              contentId={Number(videoId)}
              noPadding
              uploaderId={uploaderId}
              onRewardSubmit={data => {
                this.setState({ xpRewardInterfaceShown: false });
                attachStar(data);
              }}
            />
          )}
        </div>
      </div>
    );
  }

  determineEditButtonDoneStatus = () => {
    const { editedTitle, editedDescription, editedUrl } = this.state;
    const urlIsInvalid = !isValidYoutubeUrl(editedUrl);
    const titleIsEmpty = stringIsEmpty(editedTitle);
    const titleChanged = editedTitle !== this.props.title;
    const urlChanged =
      editedUrl !== `https://www.youtube.com/watch?v=${this.props.content}`;
    const descriptionChanged = editedDescription !== this.props.description;
    if (urlIsInvalid) return true;
    if (titleIsEmpty) return true;
    if (!titleChanged && !descriptionChanged && !urlChanged) return true;
    if (this.urlExceedsCharLimit(editedUrl)) return true;
    if (this.titleExceedsCharLimit(editedTitle)) return true;
    if (this.descriptionExceedsCharLimit(editedDescription)) return true;
    return false;
  };

  onEditCancel = () => {
    const { description } = this.props;
    this.props.onEditCancel();
    this.setState({
      editedUrl: `https://www.youtube.com/watch?v=${this.props.content}`,
      editedTitle: cleanString(this.props.title),
      editedDescription: description,
      onEdit: false,
      editDoneButtonDisabled: true
    });
  };

  onEditFinish = () => {
    const params = {
      url: this.state.editedUrl,
      videoId: this.props.videoId,
      title: finalizeEmoji(this.state.editedTitle),
      description: finalizeEmoji(this.state.editedDescription)
    };
    this.props.onEditFinish(params).then(() =>
      this.setState({
        onEdit: false,
        editDoneButtonDisabled: true
      })
    );
  };

  onEditStart = () => {
    this.props.onEditStart();
    this.setState({ onEdit: true });
  };

  onMouseOver = () => {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({ onTitleHover: true });
    }
  };

  descriptionExceedsCharLimit = description => {
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'description',
      text: description
    });
  };

  titleExceedsCharLimit = title => {
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'title',
      text: title
    });
  };

  urlExceedsCharLimit = url => {
    return exceedsCharLimit({
      contentType: 'video',
      inputType: 'url',
      text: url
    });
  };
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar
  }),
  {
    addTags,
    attachStar,
    loadTags,
    starVideo
  }
)(Details);
