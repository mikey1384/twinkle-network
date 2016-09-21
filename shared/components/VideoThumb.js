import React, {Component, PropTypes} from 'react';
import SmallDropdownButton from './SmallDropdownButton';
import EditTitleForm from './EditTitleForm';
import ConfirmModal from './Modals/ConfirmModal';
import {Link} from 'react-router';
import {
  loadVideoPageFromClientSideAsync,
  editVideoTitleAsync,
  deleteVideoAsync
} from 'redux/actions/VideoActions';
import {connect} from 'react-redux';
import UsernameText from './UsernameText';
import {cleanString} from 'helpers/stringHelpers';


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
    lastVideoId: PropTypes.number
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
  }

  render() {
    const {onEdit, confirmModalShown, onTitleHover} = this.state;
    const {size, editable, video, to, user} = this.props;
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
        <div
          className="thumbnail"
          ref="thumbnail"
        >
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
          <a
            href={`/${to}`}
            onClick={this.onLinkClick}
            onMouseOver={() => this.setState({onTitleHover: true})}
            onMouseLeave={() => this.setState({onTitleHover: false})}
          >
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                paddingBottom: '75%'
              }}
            >
              <img
                src={`https://img.youtube.com/vi/${video.videoCode}/0.jpg`}
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
          </a>
          <div className="caption"
            style={{
              height: '8rem'
            }}
          >
            { onEdit ?
              <div
                className="input-group col-xs-12"
                style={{
                  paddingBottom: '0.3em'
                }}
              >
                <EditTitleForm
                  title={video.title}
                  onEditSubmit={this.onEditedTitleSubmit}
                  onClickOutSide={this.onEditTitleCancel}
                />
              </div>
              :
              <div>
                <h5 style={{
                  whiteSpace: 'nowrap',
                  textOverflow:'ellipsis',
                  overflow:'hidden',
                  lineHeight: 'normal'
                }}>
                  <a
                    href={`/${to}`}
                    onClick={this.onLinkClick}
                    onMouseOver={() => this.setState({onTitleHover: true})}
                    onMouseLeave={() => this.setState({onTitleHover: false})}
                  >
                    {cleanString(video.title)}
                  </a>
                </h5>
                <div
                  className="alert alert-info"
                  style={{
                    position: 'absolute',
                    zIndex: '10',
                    padding: '5px',
                    display: onTitleHover ? 'block' : 'none',
                    width: 'auto',
                    maxWidth: '500px'
                  }}
                >{cleanString(video.title)}</div>
              </div>
            }
            <small style={{
              whiteSpace: 'nowrap',
              textOverflow:'ellipsis',
              overflow:'hidden'
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
    e.preventDefault();
    const {video, to, clickSafe} = this.props;
    if (!clickSafe) {
      this.props.loadVideoPage(video.id, to);
    }
  }

  onEditTitle() {
    this.setState({onEdit: true})
  }

  onEditedTitleSubmit(title) {
    const {video, editVideoTitle} = this.props;
    const videoId = video.id;
    if (title && title !== video.title) {
      editVideoTitle({title, videoId}, this);
    } else {
      this.setState({onEdit: false})
    }
  }

  onEditTitleCancel() {
    this.setState({onEdit: false});
  }

  onDeleteClick() {
    this.setState({confirmModalShown: true});
  }

  onDeleteConfirm() {
    const {deleteVideo, video, arrayIndex, lastVideoId} = this.props;
    const videoId = video.id;
    deleteVideo({videoId, arrayIndex, lastVideoId});
  }

  onHideModal() {
    this.setState({confirmModalShown: false});
  }
}
