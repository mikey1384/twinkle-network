import PropTypes from 'prop-types'
import React, { Component } from 'react'
import DropdownButton from './DropdownButton'
import EditTitleForm from './Texts/EditTitleForm'
import ConfirmModal from './Modals/ConfirmModal'
import {
  loadVideoPageFromClientSideAsync,
  editVideoTitleAsync,
  deleteVideoAsync
} from 'redux/actions/VideoActions'
import { connect } from 'react-redux'
import UsernameText from './Texts/UsernameText'
import { cleanString } from 'helpers/stringHelpers'
import Link from 'components/Link'
import FullTextReveal from 'components/FullTextReveal'
import { textIsOverflown } from 'helpers/domHelpers'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import VideoThumbImage from 'components/VideoThumbImage'

class VideoThumb extends Component {
  static propTypes = {
    arrayIndex: PropTypes.number,
    clickSafe: PropTypes.bool,
    deleteVideo: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    editVideoTitle: PropTypes.func,
    lastVideoId: PropTypes.number,
    loadVideoPage: PropTypes.func,
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
        <div>
          {editable && (
            <DropdownButton
              style={{
                position: 'absolute',
                right: '0px',
                zIndex: '1'
              }}
              icon="pencil"
              menuProps={menuProps}
            />
          )}
          <div style={{ width: '100%' }}>
            <Link to={`/${to}`} onClickAsync={this.onLinkClick}>
              <VideoThumbImage
                videoId={video.id}
                isStarred={!!video.isStarred}
                src={`https://img.youtube.com/vi/${
                  video.content
                }/mqdefault.jpg`}
              />
            </Link>
          </div>
          <div
            className="caption"
            style={{
              height: '8rem'
            }}
          >
            {onEdit ? (
              <div
                className="input-group col-xs-12"
                style={{
                  paddingBottom: '0.3em'
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
              <div>
                <h5
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
                </h5>
                <FullTextReveal
                  show={onTitleHover}
                  text={cleanString(video.title)}
                />
              </div>
            )}
            {!onEdit && (
              <small
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                Added by <UsernameText user={user} />
              </small>
            )}
            {video.numLikes > 0 && (
              <small className="pull-right">
                <span className="glyphicon glyphicon-thumbs-up" />&times;{
                  video.numLikes
                }
              </small>
            )}
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
    const { video, clickSafe } = this.props
    if (!clickSafe) {
      return this.props.loadVideoPage(video.id)
    } else {
      return Promise.resolve(true)
    }
  }

  onEditTitle = () => {
    this.setState({ onEdit: true })
  }

  onEditedTitleSubmit = title => {
    const { video, editVideoTitle } = this.props
    const videoId = video.id
    editVideoTitle({ title, videoId }, this)
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
  loadVideoPage: loadVideoPageFromClientSideAsync,
  editVideoTitle: editVideoTitleAsync,
  deleteVideo: deleteVideoAsync
})(VideoThumb)
