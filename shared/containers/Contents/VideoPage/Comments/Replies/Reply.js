import React, {Component} from 'react';
import {timeSince} from 'helpers/timeStampHelpers';
import SmallDropdownButton from 'components/SmallDropdownButton';
import EditTextArea from '../EditTextArea';
import {cleanStringWithURL} from 'helpers/stringHelpers';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';
import UsernameText from 'components/UsernameText';


export default class Reply extends Component {
  constructor() {
    super()
    this.state={
      onEdit: false,
      userListModalShown: false
    }
    this.onEditDone = this.onEditDone.bind(this)
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  render() {
    const {id, username, timeStamp, content, userIsOwner, likes, userId, myId} = this.props;
    const {onEdit, userListModalShown} = this.state;
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId == myId) userLikedThis = true;
    }
    return (
      <div
        className="media"
        key={id}
      >
        {userIsOwner && !onEdit &&
          <SmallDropdownButton
            shape="button"
            icon="pencil"
            style={{
              position: 'absolute',
              right: '0px',
              marginRight: '3em'
            }}
            menuProps={[
              {
                label: "Edit",
                onClick: () => this.setState({onEdit: true})
              },
              {
                label: "Remove",
                onClick: this.onDelete
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
            <UsernameText
              user={{
                name: username, id: userId
              }} /> <small>&nbsp;{timeSince(timeStamp)}</small></h4>
          <div>
            { onEdit ?
              <EditTextArea
                text={cleanStringWithURL(content)}
                onCancel={() => this.setState({onEdit: false})}
                onEditDone={this.onEditDone}
              /> :
              <div className="container-fluid">
                <div
                  className="row"
                  dangerouslySetInnerHTML={{__html: content}}
                  style={{paddingBottom: '1.7em'}}
                ></div>
                <div
                  className="row flexbox-container"
                >
                  <div className="pull-left">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={this.onLikeClick}
                    >
                      <span className="glyphicon glyphicon-thumbs-up"></span> {
                        `${userLikedThis ? 'Liked!' : 'Like'}`
                      }
                    </button>
                  </div>
                  <small>
                    <Likers
                      className="pull-left"
                      style={{
                        marginLeft: '0.8em',
                        color: '#f0ad4e',
                        marginTop: '1em'
                      }}
                      userId={myId}
                      likes={likes}
                      onLinkClick={() => this.setState({userListModalShown: true})}
                    />
                  </small>
                </div>
              </div>
            }
          </div>
        </div>
        { userListModalShown &&
          <UserListModal
            show={true}
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this reply"
            userId={myId}
            users={likes}
            description={user => Number(user.userId) === Number(myId) && '(You)'}
          />
        }
      </div>
    )
  }

  onEditDone(editedReply) {
    const replyId = this.props.id;
    this.props.onEditDone({replyId, editedReply}, () => {
      this.setState({onEdit: false})
    })
  }

  onLikeClick() {
    const replyId = this.props.id;
    this.props.onLikeClick(replyId);
  }

  onDelete() {
    const replyId = this.props.id;
    this.props.onDelete(replyId);
  }
}
