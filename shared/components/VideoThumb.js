import React, {Component} from 'react';
import SmallDropdownButton from './SmallDropdownButton';
import EditTitleForm from './EditTitleForm';
import ConfirmModal from './Modals/ConfirmModal';
import {Link} from 'react-router';
import {loadVideoPageFromClientSideAsync} from 'redux/actions/VideoActions';
import {connect} from 'react-redux';
import UsernameText from './UsernameText';

@connect(
  null,
  {loadVideoPage: loadVideoPageFromClientSideAsync}
)
export default class VideoThumb extends Component {
  constructor() {
    super()
    this.state = {
      onEdit: false,
      confirmModalShown: false
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
    const {onEdit, confirmModalShown} = this.state;
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
              menuProps={menuProps}
            />
          }
          <a
            href={`/${to}`}
            onClick={this.onLinkClick}
          >
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                paddingBottom: '75%'
              }}
            >
              <img
                src={`https://img.youtube.com/vi/${video.videocode}/0.jpg`}
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
                  onEditCancel={this.onEditTitleCancel}
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
                  >
                    {video.title}
                  </a>
                </h5>
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
        <ConfirmModal
          title="Remove Video"
          show={confirmModalShown}
          onHide={this.onHideModal}
          onConfirm={this.onDeleteConfirm} />
      </div>
    )
  }

  onLinkClick(e) {
    e.preventDefault();
    const {video, to} = this.props;
    this.props.loadVideoPage(video.id, to);
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
    const {deleteVideo, video, arrayNumber, lastVideoId} = this.props;
    const videoId = video.id;
    deleteVideo({videoId, arrayNumber, lastVideoId});
  }

  onHideModal() {
    this.setState({confirmModalShown: false});
  }
}
