import React, { Component } from 'react';
import { connect } from 'react-redux'
import SmallDropdownButton from './SmallDropdownButton';
import EditTitleForm from './EditTitleForm';
import ReactDOM from 'react-dom';
import ConfirmModal from './ConfirmModal';

export default class VideoThumb extends Component {
  state = {
    onEdit: false,
    confirmModalShown: false
  }

  onEditTitle () {
    this.setState({onEdit: true})
  }

  onEditedTitleSubmit(props) {
    const { video } = this.props;
    props['videoId'] = video.id;
    if (props.editedTitle && props.editedTitle !== video.title) {
      this.props.editVideoTitle(props);
    }
    this.setState({onEdit: false});
  }

  onEditTitleCancel() {
    this.setState({onEdit: false});
  }

  onDeleteClick () {
    this.setState({confirmModalShown: true});
  }

  onDeleteConfirm () {
    const { deleteVideo, video, arrayNumber, lastVideoId } = this.props;
    deleteVideo(video.id, arrayNumber, lastVideoId);
  }

  onHideModal () {
    this.setState({confirmModalShown: false});
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
        key={ video.id }
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
          <img
            src={`http://img.youtube.com/vi/${video.videocode}/0.jpg`}
          />
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
                  value={ video.title }
                  onEditSubmit={ this.onEditedTitleSubmit.bind(this) }
                  onEditCancel={ this.onEditTitleCancel.bind(this) }
                />
              </div>
              :
              <div>
                <h5 style={{
                  whiteSpace: 'nowrap',
                  textOverflow:'ellipsis',
                  overflow:'hidden',
                  lineHeight: 'normal'
                }}>{ video.title }</h5>
              </div>
            }
            <small style={{
              whiteSpace: 'nowrap',
              textOverflow:'ellipsis',
              overflow:'hidden'
            }}>{video.uploadername}</small>
          </div>
        </div>
        <ConfirmModal
          title="Delete Video"
          show={confirmModalShown}
          onHide={this.onHideModal.bind(this)}
          onConfirm={this.onDeleteConfirm.bind(this)} />
      </div>
    )
  }
}
