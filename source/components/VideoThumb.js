import PropTypes from 'prop-types'
import React, {Component} from 'react'
import DropdownButton from './DropdownButton'
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
import StarMark from 'components/StarMark'
import request from 'axios'
import {Color} from 'constants/css'
import {URL} from 'constants/URL'
import {auth} from 'redux/actions/constants'

const API_URL = `${URL}/video`

class VideoThumb extends Component {
  static propTypes = {
    arrayIndex: PropTypes.number,
    clickSafe: PropTypes.bool,
    deleteVideo: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    editVideoTitle: PropTypes.func,
    lastVideoId: PropTypes.number,
    loadVideoPage: PropTypes.func,
    size: PropTypes.string,
    to: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    userId: PropTypes.number,
    video: PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      isStarred: PropTypes.number,
      numLikes: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      title: PropTypes.string.isRequired
    }).isRequired
  }

  state = {
    onEdit: false,
    confirmModalShown: false,
    onTitleHover: false,
    xpEarned: false
  }

  mounted = false

  async componentWillMount() {
    const {userId, video: {id: videoId, isStarred}} = this.props
    this.mounted = true
    if (isStarred && userId) {
      const {data: {xpEarned}} = await request.get(`${API_URL}/xpEarned?videoId=${videoId}`, auth())
      if (this.mounted) this.setState(() => ({xpEarned}))
    }
  }

  async componentWillReceiveProps(nextProps) {
    const {userId, video: {id: videoId, isStarred}} = this.props
    if (isStarred && nextProps.userId && nextProps.userId !== userId) {
      const {data: {xpEarned}} = await request.get(`${API_URL}/xpEarned?videoId=${videoId}`, auth())
      if (this.mounted) this.setState(() => ({xpEarned}))
    }
    if (userId && !nextProps.userId) {
      this.setState(() => ({xpEarned: false}))
    }
  }

  async componentDidUpdate(prevProps) {
    const {video: {id: videoId, isStarred}} = this.props
    if (prevProps.video.id !== videoId) {
      if (!isStarred) return this.setState(() => ({xpEarned: false}))
      const {data: {xpEarned}} = await request.get(`${API_URL}/xpEarned?videoId=${videoId}`, auth())
      if (this.mounted) this.setState(() => ({xpEarned}))
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {onEdit, confirmModalShown, onTitleHover, xpEarned} = this.state
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
      <div className={size}>
        <div className="thumbnail">
          {
            editable &&
            <DropdownButton
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
                  margin: 'auto',
                  borderBottom: !!xpEarned && `1.5rem solid ${Color.lightBlue}`
                }}
              />
              {!!video.isStarred && <StarMark size={2} />}
            </div>
          </Link>
          <div
            className="caption"
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
            {!onEdit &&
              <small style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>Added by <UsernameText user={user} />
              </small>
            }
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

  onLinkClick = () => {
    const {video, clickSafe} = this.props
    if (!clickSafe) {
      return this.props.loadVideoPage(video.id)
    } else {
      return Promise.resolve(true)
    }
  }

  onEditTitle = () => {
    this.setState({onEdit: true})
  }

  onEditedTitleSubmit = title => {
    const {video, editVideoTitle} = this.props
    const videoId = video.id
    editVideoTitle({title, videoId}, this)
  }

  onEditTitleCancel = () => {
    this.setState({onEdit: false})
  }

  onDeleteClick = () => {
    this.setState({confirmModalShown: true})
  }

  onDeleteConfirm = () => {
    const {deleteVideo, video, arrayIndex, lastVideoId} = this.props
    const videoId = video.id
    deleteVideo({videoId, arrayIndex, lastVideoId})
  }

  onHideModal = () => {
    this.setState({confirmModalShown: false})
  }

  onMouseOver = () => {
    if (textIsOverflown(this.thumbLabel)) {
      this.setState({onTitleHover: true})
    }
  }
}

export default connect(
  state => ({userId: state.UserReducer.userId}),
  {
    loadVideoPage: loadVideoPageFromClientSideAsync,
    editVideoTitle: editVideoTitleAsync,
    deleteVideo: deleteVideoAsync
  }
)(VideoThumb)
