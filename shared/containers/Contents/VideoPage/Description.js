import React, { Component } from 'react';
import SmallDropdownButton from 'components/SmallDropdownButton';
import Textarea from 'react-textarea-autosize';

export default class Description extends Component {
  state = {
    onEdit: false,
    editedTitle: this.props.title,
    editedDescription: this.cleanString(this.props.description),
    editDoneButtonDisabled: true
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.setState({
        editedTitle: nextProps.title
      })
    }
    if (nextProps.description !== this.props.description) {
      this.setState({
        editedDescription: this.cleanString(nextProps.description)
      })
    }
  }

  render() {
    const menuProps = [
      {
        label: 'Edit',
        onClick: this.onEdit.bind(this)
      },
      {
        label: 'Delete',
        onClick: this.onDeleteClick.bind(this)
      }
    ]

    const { onEdit } = this.state;

    return (
      <div>
        <div
          className="row page-header text-center"
          style={{paddingBottom: '1em'}}
        >
          { this.props.uploaderId == this.props.userId && !onEdit &&
            <SmallDropdownButton menuProps={menuProps} />
          }
          <div>
            { onEdit ?
              <form className="col-sm-6 col-sm-offset-3" onSubmit={ e => e.preventDefault() }>
                <input
                  ref="editTitleInput"
                  type="text"
                  className="form-control"
                  placeholder="Enter Title..."
                  value={this.state.editedTitle}
                  onChange={ event => {
                    this.setState({editedTitle: event.target.value}, () => {
                      this.determineEditButtonDoneStatus();
                    });
                  }}
                />
              </form> :
              <h1>
                <span>{this.props.title}</span>
              </h1>
            }
          </div>
          <div
            className="col-sm-12"
            style={{
              paddingTop: onEdit ? '1em' : null
            }}
          >
            <small
              style={{
                whiteSpace: 'nowrap',
                textOverflow:'ellipsis',
                overflow:'hidden',
                lineHeight: 'normal'
              }}>Added by <strong>{this.props.uploaderName}</strong>
            </small>
          </div>
        </div>
        <div className="row container-fluid">
          <h2>Description</h2>
          { onEdit ?
            <div>
              <form>
                <Textarea
                  minRows={4}
                  className="form-control"
                  placeholder="Enter Description"
                  value={this.state.editedDescription}
                  onChange={ event => {
                    this.determineEditButtonDoneStatus();
                    this.setState({editedDescription: event.target.value}, () => {
                      this.determineEditButtonDoneStatus();
                    });
                  }}
                 />
              </form>
              <div
                className="row container-fluid text-center"
                style={{
                  marginTop: '1em'
                }}
              >
                <button
                  className="btn btn-default btn-sm"
                  disabled={this.state.editDoneButtonDisabled}
                  onClick={this.onEditFinish.bind(this)}
                >Done</button>
                <button
                  className="btn btn-default btn-sm"
                  style={{marginLeft: '5px'}}
                  onClick={this.onEditCancel.bind(this)}
                >Cancel</button>
              </div>
            </div> :
            <p dangerouslySetInnerHTML={{__html: this.props.description}}/>
          }
        </div>
      </div>
    )
  }

  cleanString(string) {
    if (typeof string !== 'undefined') {
      const regexBr = /<br\s*[\/]?>/gi;
      const regexAnchor = /<a[^>]*>|<\/a>/g;
      const cleanedString = string.replace(regexBr, "\n").replace(regexAnchor, "");
      return cleanedString;
    }
    return '';
  }

  onEdit() {
    this.setState({onEdit: true})
  }

  determineEditButtonDoneStatus() {
    const titleIsEmpty = this.state.editedTitle === '' ? true : false;
    const titleChanged = this.state.editedTitle === this.props.title ? false : true;
    const descriptionChanged = this.state.editedDescription === this.cleanString(this.props.description) ? false : true;
    const editDoneButtonDisabled = (!titleIsEmpty && (titleChanged || descriptionChanged)) ? false : true;
    this.setState({editDoneButtonDisabled});
  }

  onEditFinish() {
    const params = {
      videoId: this.props.videoId,
      title: this.state.editedTitle,
      description: this.state.editedDescription
    }
    this.props.onEditFinish(params, this);
  }

  onEditCancel() {
    this.setState({
      editedTitle: this.props.title,
      editedDescription: this.cleanString(this.props.description),
      onEdit: false,
      editDoneButtonDisabled: true
    });
  }

  onDeleteClick() {
    this.props.onDelete();
  }
}
