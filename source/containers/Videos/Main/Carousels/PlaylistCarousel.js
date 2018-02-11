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
    this.onEditTitle = this.onEditTitle.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.onEditedTitleSubmit = this.onEditedTitleSubmit.bind(this)
    this.onEditTitleCancel = this.onEditTitleCancel.bind(this)
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  componentDidMount() {
    addEvent(window, 'resize', this.onResize)
  }

  componentWillUnmount() {
    unbindListeners.call(this)
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
      <div className="container-fluid">
        <div className="row container-fluid" style={{ position: 'relative' }}>
          {onEdit ? (
            <div
              className="input-group col-sm-6 pull-left"
              style={{
                paddingBottom: '0.3em'
              }}
            >
              <EditTitleForm
                autoFocus
                title={title}
                onEditSubmit={this.onEditedTitleSubmit}
                onClickOutSide={this.onEditTitleCancel}
              />
            </div>
          ) : (
            <h4 className="pull-left">
              <a
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ playlistModalShown: true })}
              >
                {cleanString(title)}
              </a>
              <span>
                &nbsp;<small>by {uploader}</small>
              </span>
            </h4>
          )}
          {(editable || isAdmin) && (
            <DropdownButton
              style={{
                position: 'absolute',
                right: 0,
                zIndex: '1'
              }}
              shape="button"
              icon="pencil"
              menuProps={menuProps}
            />
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

  renderThumbs() {
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

  onEditTitle() {
    this.setState({ onEdit: true })
  }

  onEditedTitleSubmit(title) {
    const { editPlaylistTitleAsync, id: playlistId, arrayIndex } = this.props
    editPlaylistTitleAsync({ title, playlistId }, arrayIndex, this)
  }

  onEditTitleCancel() {
    this.setState({ onEdit: false })
  }

  onDeleteClick() {
    this.setState({ deleteConfirmModalShown: true })
  }

  onDeleteConfirm() {
    const { deletePlaylistAsync, id } = this.props
    deletePlaylistAsync(id, this)
  }

  onResize() {
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
