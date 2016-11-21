import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import {timeSince} from 'helpers/timeStampHelpers';
import {cleanStringWithURL} from 'helpers/stringHelpers';
import SmallDropdownButton from 'components/SmallDropdownButton';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import PanelReplies from './PanelReplies';
import ReplyInputArea from './PanelReplies/ReplyInputArea';
import EditTextArea from './EditTextArea';
import UsernameText from 'components/UsernameText';
import Button from 'components/Button';
import LikeButton from 'components/LikeButton';
import {scrollElementToCenter} from 'helpers/domHelpers';
import ConfirmModal from 'components/Modals/ConfirmModal';


export default class PanelComment extends Component {
  constructor() {
    super()
    this.state = {
      replyInputShown: false,
      onEdit: false,
      userListModalShown: false,
      clickListenerState: false,
      confirmModalShown: false
    }
    this.onReplyButtonClick = this.onReplyButtonClick.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
    this.onEditDone = this.onEditDone.bind(this)
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleteListenerToggle !== this.props.deleteListenerToggle) {
      if (this.props.lastDeletedCommentIndex - 1 === this.props.index) {
        scrollElementToCenter(this.PanelComment);
      }
    }
  }

  render() {
    const {replyInputShown, onEdit, userListModalShown, clickListenerState, confirmModalShown} = this.state;
    const {
      comment, userId, parent, type, onEditDone, onLikeClick, onDelete, onReplySubmit
    } = this.props;

    const userIsOwner = comment.userId === userId;
    let userLikedThis = false;
    for (let i = 0; i < comment.likes.length; i++) {
      if (comment.likes[i].userId === userId) userLikedThis = true;
    }
    return (
      <li
        className="media"
        style={{marginTop: this.props.marginTop && '1em'}}
        ref={ref => {this.PanelComment = ref}}
      >
        {userIsOwner && !onEdit &&
          <div className="row">
            <SmallDropdownButton
              shape="button"
              icon="pencil"
              style={{
                position: 'absolute',
                right: '5.5%',
                opacity: 0.7
              }}
              menuProps={[
                {
                  label: "Edit",
                  onClick: () => this.setState({onEdit: true})
                },
                {
                  label: "Remove",
                  onClick: () => this.setState({confirmModalShown: true})
                }
              ]}
            />
          </div>
        }
        <div className="media-left">
          <a>
            <img
              className="media-object"
              src="/img/default.jpg"
              style={{width: '45px'}}
            />
          </a>
        </div>
        <div className="media-body">
          <h5 className="media-heading">
            <UsernameText user={{
              name: comment.username,
              id: comment.userId
            }} /> <small>&nbsp;{timeSince(comment.timeStamp)}</small>
          </h5>
          {comment.targetUserId && !!comment.replyId && comment.replyId !== parent.id &&
            <span style={{color: '#158cba'}}>
              to: <UsernameText user={{name: comment.targetUserName, id: comment.targetUserId}} />
            </span>
          }
          {onEdit ?
            <EditTextArea
              text={cleanStringWithURL(comment.content)}
              onCancel={() => this.setState({onEdit: false})}
              onEditDone={this.onEditDone}
            /> :
            <div className="container-fluid">
              <div
                className="row"
                style={{paddingBottom: '1.3em'}}
                dangerouslySetInnerHTML={{__html: comment.content}}
              ></div>
              <div
                className="row flexbox-container"
              >
                <div className="pull-left">
                  <LikeButton
                    onClick={this.onLikeClick}
                    liked={userLikedThis}
                    small
                  />
                  <Button
                    style={{marginLeft: '0.5em'}}
                    className="btn btn-warning btn-sm"
                    onClick={this.onReplyButtonClick}
                  >
                    <span className="glyphicon glyphicon-comment"></span> Reply
                  </Button>
                </div>
                <small>
                  <Likers
                    className="pull-left"
                    style={{
                      fontWeight: 'bold',
                      marginLeft: '0.8em',
                      color: '#f0ad4e',
                      marginTop: '1em'
                    }}
                    userId={userId}
                    likes={comment.likes}
                    onLinkClick={() => this.setState({userListModalShown: true})}
                  />
                </small>
              </div>
            </div>
          }
          <PanelReplies
            userId={userId}
            replies={comment.replies}
            comment={comment}
            parent={parent}
            type={type}
            onDelete={onDelete}
            onLikeClick={onLikeClick}
            onEditDone={onEditDone}
            onReplySubmit={onReplySubmit}
          />
          {replyInputShown && <ReplyInputArea
              clickListenerState={clickListenerState}
              onSubmit={this.onReplySubmit}
              numReplies={comment.replies.length}
            />
          }
        </div>
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this comment"
            userId={userId}
            users={comment.likes}
            description={user => user.userId === userId && '(You)'}
          />
        }
        {confirmModalShown &&
          <ConfirmModal
            onHide={() => this.setState({confirmModalShown: false})}
            title="Remove Comment"
            onConfirm={this.onDelete}
          />
        }
      </li>
    )
  }

  onEditDone(editedComment) {
    const {onEditDone, comment} = this.props;
    onEditDone({editedComment, commentId: comment.id}, () => {
      this.setState({onEdit: false})
    })
  }

  onLikeClick() {
    const {comment} = this.props;
    this.props.onLikeClick(comment.id);
  }

  onReplyButtonClick() {
    const {clickListenerState, replyInputShown} = this.state;
    if (!replyInputShown) return this.setState({replyInputShown: true});
    this.setState({clickListenerState: !clickListenerState})
  }

  onReplySubmit(replyContent) {
    const {parent, comment, onReplySubmit} = this.props;
    onReplySubmit(replyContent, comment, parent);
  }

  onDelete() {
    const {comment, onDelete, index, deleteCallback, isFirstComment} = this.props;
    deleteCallback(index, isFirstComment);
    onDelete(comment.id);
  }
}
