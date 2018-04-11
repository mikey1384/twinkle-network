import PropTypes from 'prop-types'
import React, { Component } from 'react'
import DropdownButton from './DropdownButton'
import EditTitleForm from './Texts/EditTitleForm'
import ConfirmModal from './Modals/ConfirmModal'
import {
  editVideoTitle,
  deleteVideo
} from 'redux/actions/VideoActions'
import { connect } from 'react-redux'
import UsernameText from './Texts/UsernameText'
import { cleanString } from 'helpers/stringHelpers'
import Link from 'components/Link'
import FullTextReveal from 'components/FullTextReveal'
import { textIsOverflown } from 'helpers/domHelpers'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import VideoThumbImage from 'components/VideoThumbImage'
import { Color } from 'constants/css'
import { css } from 'emotion'

class VideoThumb extends Component {
  static propTypes = {
    arrayIndex: PropTypes.number,
    clickSafe: PropTypes.bool,
    deleteVideo: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    editVideoTitle: PropTypes.func,
    lastVideoId: PropTypes.number,
    style: PropTypes.object,
    to: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    video: PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      isStarred: PropTypes.number,
      numLikes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired
    }).isRequired
  }

  state = {
    onEdit: false,
    confirmModalShown: false,
    onTitleHover: false
  }

  render() {
    const { onEdit, confirmModalShown, onTitleHover } = this.state
    const { editable, video, style, to, user } = this.props
    const menuProps = [
      {
        label: 'Edit',
        onClick: this.onEditTitle
      },
      {
        label: 'Remove',
        onClick: this.onDeleteClick
      }
    ]
    return (
      <ErrorBoundary style={style}>
        <div
          className={css`
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: flex-end;
            position: relative;
            font-size: 1.5rem;
            box-shadow: 0 0 5px ${Color.darkGray()};
            background: ${Color.whiteGray()};
            border-radius: 1px;
            p {
              font-weight: bold;
            }
          `}
        >
          {editable && (
            <DropdownButton
              style={{
                position: 'absolute',
                zIndex: '1'
              }}
              direction="left"
              snow
              icon="pencil"
              noBorderRadius
              menuProps={menuProps}
            />
          )}
          <div style={{ width: '100%' }}>
            <Link to={`/${to}`} onClickAsync={this.onLinkClick}>
              <VideoThumbImage
                height="65%"
                videoId={video.id}
                isStarred={!!video.isStarred}
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
                  title={video.title}
                  onEditSubmit={this.onEditedTitleSubmit}
                  onClickOutSide={this.onEditTitleCancel}
                />
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <p
                  ref={ref => {
                    this.thumbLabel = ref
                  }}
                  style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    lineHeight: 'normal'
                  }}
                >
                  <a
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
                <div>
                  Added by <UsernameText user={user} />
                </div>
              )}
              {video.numLikes > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <span className="glyphicon glyphicon-thumbs-up" />&times;{
                    video.numLikes
                  }
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
    )
  }

  onLinkClick = () => {
    const { clickSafe } = this.props
    return Promise.resolve(clickSafe)
  }

  onEditTitle = () => {
    this.setState({ onEdit: true })
  }

  onEditedTitleSubmit = async title => {
    const { video, editVideoTitle } = this.props
    const videoId = video.id
    await editVideoTitle({ title, videoId })
    this.setState({ onEdit: false })
  }

  onEditTitleCancel = () => {
    this.setState({ onEdit: false })
  }

  onDeleteClick = () => {
    this.setState({ confirmModalShown: true })
  }

  onDeleteConfirm = () => {
    const { deleteVideo, video, arrayIndex, lastVideoId } = this.props
    const videoId = video.id
    deleteVideo({ videoId, arrayIndex, lastVideoId })
  }

  onHideModal = () => {
    this.setState({ confirmModalShown: false })
  }

  onMouseOver = () => {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({ onTitleHover: true })
    }
  }
}

export default connect(state => ({ userId: state.UserReducer.userId }), {
  editVideoTitle,
  deleteVideo
})(VideoThumb)
