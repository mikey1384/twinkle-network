import React, { Component } from 'react';
import SmallDropdownButton from './SmallDropdownButton';
import EditTitleForm from './EditTitleForm';
import ConfirmModal from './Modals/ConfirmModal';
import { Link } from 'react-router';
import { loadVideoPageFromClientSideAsync } from 'redux_helpers/actions/VideoActions';

export default class VideoThumb extends Component {
  state = {
    onEdit: false,
    confirmModalShown: false
  }

  render () {
    const { onEdit, confirmModalShown } = this.state;
    const { size, editable, video } = this.props;
    const menuProps = [
      {
        label: 'Edit',
        onClick: this.onEditTitle.bind(this)
      },
      {
        label: 'Remove',
        onClick: this.onDeleteClick.bind(this)
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
            href={`/${this.props.to}`}
            onClick={ this.onLinkClick.bind(this) }
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
            {
              onEdit ?
              <div
                className="input-group col-sm-12"
                style={{
                  paddingBottom: '0.3em'
                }}
              >
                <EditTitleForm
                  title={video.title}
                  onEditSubmit={ this.onEditedTitleSubmit.bind(this) }
                  onEditCancel={ this.onEditTitleCancel.bind(this) }
                  onClickOutSide={ this.onEditTitleCancel.bind(this) }
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
                    href={`/${this.props.to}`}
                    onClick={ this.onLinkClick.bind(this) }
                  >
                    { video.title }
                  </a>
                </h5>
              </div>
            }
            <small style={{
              whiteSpace: 'nowrap',
              textOverflow:'ellipsis',
              overflow:'hidden'
            }}>Added by <strong>{video.uploadername}</strong></small>
          </div>
        </div>
        <ConfirmModal
          title="Remove Video"
          show={confirmModalShown}
          onHide={this.onHideModal.bind(this)}
          onConfirm={this.onDeleteConfirm.bind(this)} />
      </div>
    )
  }

  onLinkClick(e) {
    e.preventDefault();
    this.props.dispatch(loadVideoPageFromClientSideAsync({
      title: this.props.video.title,
      description: this.props.video.description,
      videocode: this.props.video.videocode,
      uploaderName: this.props.video.uploadername
    }, this.props.to))
  }

  onEditTitle () {
    this.setState({onEdit: true})
  }

  onEditedTitleSubmit(title) {
    const { video } = this.props;
    const videoId = video.id;
    if (title && title !== video.title) {
      this.props.editVideoTitle({title, videoId}, this);
    } else {
      this.setState({onEdit: false})
    }
  }

  onEditTitleCancel() {
    this.setState({onEdit: false});
  }

  onDeleteClick () {
    this.setState({confirmModalShown: true});
  }

  onDeleteConfirm () {
    const { deleteVideo, video, arrayNumber, lastVideoId } = this.props;
    const videoId = video.id;
    deleteVideo({videoId, arrayNumber, lastVideoId});
  }

  onHideModal () {
    this.setState({confirmModalShown: false});
  }
}
