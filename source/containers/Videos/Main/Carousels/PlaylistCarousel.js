import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ExecutionEnvironment from 'exenv'
import Carousel from 'components/Carousel'
import VideoThumb from 'components/VideoThumb'
import DropdownButton from 'components/DropdownButton'
import EditTitleForm from 'components/Texts/EditTitleForm'
import EditPlaylistModal from '../Modals/EditPlaylistModal'
import PlaylistModal from '../Modals/PlaylistModal'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { addEvent } from 'helpers/listenerHelpers'
import {
  editPlaylistTitleAsync,
  openChangePlaylistVideosModalAsync,
  openReorderPlaylistVideosModal,
  deletePlaylistAsync,
  resetPlaylistModalState
} from 'redux/actions/PlaylistActions'
import { connect } from 'react-redux'
import { cleanString } from 'helpers/stringHelpers'
import { css } from 'emotion'
import { Color } from 'constants/css'

class PlaylistCarousel extends Component {
  static propTypes = {
    arrayIndex: PropTypes.number.isRequired,
    clickSafe: PropTypes.bool.isRequired,
    deletePlaylistAsync: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    editPlaylistTitleAsync: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    isAdmin: PropTypes.bool,
    playlist: PropTypes.array.isRequired,
    showAllButton: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    uploader: PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.defaultNumSlides = 5
    let numSlides = this.defaultNumSlides
    if (ExecutionEnvironment.canUseDOM) {
      numSlides =
        document.documentElement.clientWidth < 768 ? 3 : this.defaultNumSlides
    }
    this.state = {
      onEdit: false,
      changePLVideosModalShown: false,
      reorderPLVideosModalShown: false,
      deleteConfirmModalShown: false,
      playlistModalShown: false,
      numSlides
    }
  }

  componentDidMount() {
    this.mounted = true
    addEvent(window, 'resize', this.onResize)
  }

  componentWillUnmount() {
    unbindListeners.call(this)
    this.mounted = false
    function unbindListeners() {
      if (ExecutionEnvironment.canUseDOM) {
        removeEvent(window, 'resize', this.onResize)
      }

      function removeEvent(elem, type, eventHandle) {
        if (elem === null || typeof elem === 'undefined') {
          return
        }
        if (elem.removeEventListener) {
          elem.removeEventListener(type, eventHandle, false)
        } else if (elem.detachEvent) {
          elem.detachEvent('on' + type, eventHandle)
        } else {
          elem['on' + type] = null
        }
      }
    }
  }

  render() {
    const {
      onEdit,
      changePLVideosModalShown,
      reorderPLVideosModalShown,
      deleteConfirmModalShown,
      playlistModalShown,
      numSlides
    } = this.state
    const { title, uploader, editable, isAdmin, id, showAllButton } = this.props
    const menuProps = [
      {
        label: 'Edit Title',
        onClick: this.onEditTitle
      },
      {
        label: 'Change Videos',
        onClick: () => this.setState({ changePLVideosModalShown: true })
      },
      {
        label: 'Reorder Videos',
        onClick: () => this.setState({ reorderPLVideosModalShown: true })
      },
      {
        separator: true
      },
      {
        label: 'Remove Playlist',
        onClick: this.onDeleteClick
      }
    ]

    return (
      <div
        className={css`
          margin-bottom: 1.5rem;
          &:last-child {
            margin-bottom: 0;
          }
        `}
      >
        <div
          className={css`
            position: relative;
            display: flex;
            align-items: center;
            padding-bottom: 0.8rem;
            h2 {
              cursor: pointer;
              display: inline;
              color: ${Color.blue()};
              &:hover {
                color: ${Color.logoBlue()};
              }
            }
            small {
              font-size: 1.5rem;
              color: ${Color.gray()};
            }
          `}
        >
          {onEdit ? (
            <EditTitleForm
              autoFocus
              style={{ width: '90%' }}
              title={title}
              onEditSubmit={this.onEditedTitleSubmit}
              onClickOutSide={this.onEditTitleCancel}
            />
          ) : (
            <div>
              <h2 onClick={() => this.setState({ playlistModalShown: true })}>
                {cleanString(title)}
                &nbsp;<small>by {uploader}</small>
              </h2>
            </div>
          )}
          {(editable || isAdmin) && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'row-reverse',
                alignItems: 'center'
              }}
            >
              <DropdownButton
                snow
                direction="left"
                icon="pencil"
                menuProps={menuProps}
              />
            </div>
          )}
        </div>
        <Carousel
          progressBar={false}
          slidesToShow={numSlides}
          slidesToScroll={numSlides}
          cellSpacing={20}
          dragging={true}
          showAllButton={showAllButton}
          onShowAll={() => this.setState({ playlistModalShown: true })}
        >
          {this.renderThumbs()}
        </Carousel>
        {playlistModalShown && (
          <PlaylistModal
            title={cleanString(title)}
            onHide={() => this.setState({ playlistModalShown: false })}
            playlistId={id}
          />
        )}
        {changePLVideosModalShown && (
          <EditPlaylistModal
            modalType="change"
            playlistId={id}
            onHide={() => this.setState({ changePLVideosModalShown: false })}
          />
        )}
        {reorderPLVideosModalShown && (
          <EditPlaylistModal
            modalType="reorder"
            playlistId={id}
            onHide={() => this.setState({ reorderPLVideosModalShown: false })}
          />
        )}
        {deleteConfirmModalShown && (
          <ConfirmModal
            title="Remove Playlist"
            onConfirm={this.onDeleteConfirm}
            onHide={() => this.setState({ deleteConfirmModalShown: false })}
          />
        )}
      </div>
    )
  }

  renderThumbs = () => {
    const { playlist, clickSafe, id: playlistId } = this.props
    return playlist.map((thumb, index) => {
      return (
        <VideoThumb
          to={`videos/${thumb.videoId}?playlist=${playlistId}`}
          clickSafe={clickSafe}
          key={index}
          video={{
            id: thumb.videoId,
            content: thumb.content,
            isStarred: thumb.isStarred,
            title: thumb.video_title,
            description: thumb.video_description,
            uploaderName: thumb.video_uploader,
            numLikes: thumb.numLikes
          }}
          user={{ name: thumb.video_uploader, id: thumb.video_uploader_id }}
        />
      )
    })
  }

  onEditTitle = () => {
    this.setState({ onEdit: true })
  }

  onEditedTitleSubmit = title => {
    const { editPlaylistTitleAsync, id: playlistId, arrayIndex } = this.props
    editPlaylistTitleAsync({ title, playlistId }, arrayIndex, this)
  }

  onEditTitleCancel = () => {
    this.setState({ onEdit: false })
  }

  onDeleteClick = () => {
    this.setState({ deleteConfirmModalShown: true })
  }

  onDeleteConfirm = async() => {
    const { deletePlaylistAsync, id } = this.props
    this.setState({ deleteConfirmModalShown: false })
    deletePlaylistAsync(id)
  }

  onResize = () => {
    if (ExecutionEnvironment.canUseDOM) {
      this.setState({
        numSlides:
          document.documentElement.clientWidth < 768 ? 3 : this.defaultNumSlides
      })
    }
  }
}

export default connect(
  state => ({
    clickSafe: state.PlaylistReducer.clickSafe,
    isAdmin: state.UserReducer.isAdmin
  }),
  {
    editPlaylistTitleAsync,
    openChangePlaylistVideosModalAsync,
    openReorderPlaylistVideosModal,
    deletePlaylistAsync,
    resetPlaylistModalState
  }
)(PlaylistCarousel)
