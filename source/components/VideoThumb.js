import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DropdownButton from './Buttons/DropdownButton';
import EditTitleForm from './Texts/EditTitleForm';
import ConfirmModal from './Modals/ConfirmModal';
import { editVideoTitle, deleteVideo } from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import UsernameText from './Texts/UsernameText';
import { cleanString } from 'helpers/stringHelpers';
import Link from 'components/Link';
import FullTextReveal from 'components/Texts/FullTextReveal';
import { textIsOverflown } from 'helpers';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import VideoThumbImage from 'components/VideoThumbImage';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { charLimit } from 'constants/defaultValues';

class VideoThumb extends Component {
  static propTypes = {
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

  state = {
    onEdit: false,
    confirmModalShown: false,
    onTitleHover: false
  };

  render() {
    const { onEdit, confirmModalShown, onTitleHover } = this.state;
    const {
      className,
      deletable,
      editable,
      video,
      style,
      to,
      user
    } = this.props;
    const menuProps = [];
    if (editable) {
      menuProps.push({
        label: 'Edit',
        onClick: this.onEditTitle
      });
    }
    if (deletable || editable) {
      menuProps.push({
        label: 'Remove',
        onClick: this.onDeleteClick
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
            <Link to={`/${to}`} onClickAsync={this.onLinkClick}>
              <VideoThumbImage
                height="65%"
                videoId={video.id}
                difficulty={video.difficulty}
                src={`https://img.youtube.com/vi/${
                  video.content
                }/mqdefault.jpg`}
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
                  maxLength={charLimit.video.title}
                  title={video.title}
                  onEditSubmit={this.onEditedTitleSubmit}
                  onClickOutSide={this.onEditTitleCancel}
                />
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <p
                  ref={ref => {
                    this.thumbLabel = ref;
                  }}
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
                    onClick={this.onLinkClick}
                    onMouseOver={this.onMouseOver}
                    onMouseLeave={() => this.setState({ onTitleHover: false })}
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
            onHide={this.onHideModal}
            onConfirm={this.onDeleteConfirm}
          />
        )}
      </ErrorBoundary>
    );
  }

  onLinkClick = () => {
    const { clickSafe } = this.props;
    return Promise.resolve(clickSafe);
  };

  onEditTitle = () => {
    this.setState({ onEdit: true });
  };

  onEditedTitleSubmit = async title => {
    const { video, editVideoTitle } = this.props;
    const videoId = video.id;
    await editVideoTitle({ title, videoId });
    this.setState({ onEdit: false });
  };

  onEditTitleCancel = () => {
    this.setState({ onEdit: false });
  };

  onDeleteClick = () => {
    this.setState({ confirmModalShown: true });
  };

  onDeleteConfirm = () => {
    const { deleteVideo, video, arrayIndex, lastVideoId } = this.props;
    const videoId = video.id;
    deleteVideo({ videoId, arrayIndex, lastVideoId });
  };

  onHideModal = () => {
    this.setState({ confirmModalShown: false });
  };

  onMouseOver = () => {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({ onTitleHover: true });
    }
  };
}

export default connect(
  state => ({ userId: state.UserReducer.userId }),
  {
    editVideoTitle,
    deleteVideo
  }
)(VideoThumb);
