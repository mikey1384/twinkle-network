import PropTypes from 'prop-types'
import React, {Component} from 'react'
import SmallDropdownButton from './SmallDropdownButton'
import EditTitleForm from './Texts/EditTitleForm'
import ConfirmModal from './Modals/ConfirmModal'
import {
  loadVideoPageFromClientSideAsync,
  editVideoTitleAsync,
  deleteVideoAsync
} from 'redux/actions/VideoActions'
import {connect} from 'react-redux'
import UsernameText from './Texts/UsernameText'
import {cleanString} from 'helpers/stringHelpers'
import Link from 'components/Link'
import FullTextReveal from 'components/FullTextReveal'
import {textIsOverflown} from 'helpers/domHelpers'

@connect(
  null,
  {
    loadVideoPage: loadVideoPageFromClientSideAsync,
    editVideoTitle: editVideoTitleAsync,
    deleteVideo: deleteVideoAsync
  }
)
export default class VideoThumb extends Component {
  static propTypes = {
    video: PropTypes.object.isRequired,
    to: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    size: PropTypes.string,
    editable: PropTypes.bool,
    arrayIndex: PropTypes.number,
    clickSafe: PropTypes.bool,
    lastVideoId: PropTypes.number,
    loadVideoPage: PropTypes.func,
    editVideoTitle: PropTypes.func,
    deleteVideo: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      onEdit: false,
      confirmModalShown: false,
      onTitleHover: false
    }
    this.onEditTitle = this.onEditTitle.bind(this)
    this.onEditedTitleSubmit = this.onEditedTitleSubmit.bind(this)
    this.onEditTitleCancel = this.onEditTitleCancel.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
    this.onLinkClick = this.onLinkClick.bind(this)
    this.onHideModal = this.onHideModal.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
  }

  render() {
    const {onEdit, confirmModalShown, onTitleHover} = this.state
    const {size, editable, video, to, user} = this.props
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
      <div
        className={size}
      >
        <div className="thumbnail">
          {
            editable &&
            <SmallDropdownButton
              style={{
                position: 'absolute',
                right: '0px',
                marginRight: '2rem',
                zIndex: '1'
              }}
              icon="pencil"
              menuProps={menuProps}
            />
          }
          <Link
            to={`/${to}`}
            onClickAsync={this.onLinkClick}
          >
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                paddingBottom: '75%'
              }}
            >
              <img
                alt="Thumbnail"
                src={`https://img.youtube.com/vi/${video.content}/0.jpg`}
                style={{
                  width: '100%',
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  bottom: '0px',
                  right: '0px',
                  margin: 'auto'
                }}
              />
            </div>
          </Link>
          <div className="caption"
            style={{
              height: '8rem'
            }}
          >
            {onEdit ?
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
              :
              <div>
                <h5
                  ref={ref => { this.thumbLabel = ref }}
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
                    onMouseLeave={() => this.setState({onTitleHover: false})}
                  >
                    {cleanString(video.title)}
                  </a>
                </h5>
                <FullTextReveal show={onTitleHover} text={cleanString(video.title)} />
              </div>
            }
            <small style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>Added by <UsernameText user={user} /></small>
            {video.numLikes > 0 &&
              <small className="pull-right">
                <span className="glyphicon glyphicon-thumbs-up" />&times;{video.numLikes}
              </small>
            }
          </div>
        </div>
        {confirmModalShown &&
          <ConfirmModal
            title="Remove Video"
            onHide={this.onHideModal}
            onConfirm={this.onDeleteConfirm}
          />
        }
      </div>
    )
  }

  onLinkClick(e) {
    const {video, clickSafe} = this.props
    if (!clickSafe) {
      return this.props.loadVideoPage(video.id)
    } else {
      return Promise.resolve(true)
    }
  }

  onEditTitle() {
    this.setState({onEdit: true})
  }

  onEditedTitleSubmit(title) {
    const {video, editVideoTitle} = this.props
    const videoId = video.id
    editVideoTitle({title, videoId}, this)
  }

  onEditTitleCancel() {
    this.setState({onEdit: false})
  }

  onDeleteClick() {
    this.setState({confirmModalShown: true})
  }

  onDeleteConfirm() {
    const {deleteVideo, video, arrayIndex, lastVideoId} = this.props
    const videoId = video.id
    deleteVideo({videoId, arrayIndex, lastVideoId})
  }

  onHideModal() {
    this.setState({confirmModalShown: false})
  }

  onMouseOver() {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({onTitleHover: true})
    }
  }
}
