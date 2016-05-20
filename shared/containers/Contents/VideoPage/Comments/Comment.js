import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { timeSince } from 'helpers/TimeStampHelper';
import ReplyInputArea from './ReplyInputArea';
import EditCommentTextArea from './EditCommentTextArea';
import { cleanStringWithURL } from 'helpers/StringHelper';
import SmallDropdownButton from 'components/SmallDropdownButton';

export default class Comment extends Component {
  state = {
    replyInputShown: false,
    onEdit: false
  }
  render() {
    const { replyInputShown, onEdit } = this.state;
    const { comment } = this.props;
    return (
      <li
        className="media"
        style={{marginTop: this.props.marginTop && '2em'}}
      >
        { this.props.userIsOwner && !onEdit &&
          <SmallDropdownButton
            rightMargin='3em'
            menuProps={[
              {
                label: "Edit",
                onClick: () => this.setState({onEdit: true})
              },
              {
                label: "Remove",
                onClick: () => console.log("clicked!!")
              }
            ]}
          />
        }
        <div className="media-left">
          <a>
            <img
              className="media-object"
              src="/img/default.jpg"
              style={{width: '64px'}}
            />
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">
            { comment.posterName } <small>&nbsp;{ timeSince(comment.timeStamp) }</small>
          </h4>
          { onEdit ?
            <EditCommentTextArea
              text={cleanStringWithURL(comment.content)}
              onCancel={() => this.setState({onEdit: false})}
              onEditDone={this.onEditDone.bind(this)}
            /> :
            <div className="container-fluid">
              <div
                className="row"
                style={{paddingBottom: '2em'}}
                dangerouslySetInnerHTML={{__html: comment.content}}
              ></div>
              <div className="row">
                <button
                  className="btn btn-default btn-sm"
                  onClick={ () => this.setState({replyInputShown: true}) }
                >
                  <span className="glyphicon glyphicon-comment"></span> Reply
                </button>
                <button
                  className="btn btn-default btn-sm"
                  style={{marginLeft: '0.5em'}}
                >
                  <span className="glyphicon glyphicon-thumbs-up"></span> Like
                </button>
              </div>
            </div>
          }
          { replyInputShown && <ReplyInputArea /> }
        </div>
      </li>
    )
  }

  onEditDone(editedComment) {
    const { commentId } = this.props;
    this.props.onEditDone(editedComment, commentId, () => {
      this.setState({onEdit: false})
    })
  }
}
