import React, { Component } from 'react';
import { timeSince } from 'helpers/TimeStampHelper';
import SmallDropdownButton from 'components/SmallDropdownButton';
import EditTextArea from '../EditTextArea';
import { cleanStringWithURL } from 'helpers/StringHelper';
import Likers from 'components/Likers';
import UserListModal from 'components/Modals/UserListModal';


export default class Reply extends Component {
  state={
    onEdit: false,
    userListModalShown: false
  }
  render() {
    const { id, username, timeStamp, content, userIsOwner, likes, userId } = this.props;
    const { onEdit, userListModalShown } = this.state;
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId == userId) userLikedThis = true;
    }
    return (
      <div
        className="media"
        key={id}
      >
        { userIsOwner && !onEdit &&
          <SmallDropdownButton
            rightMargin='3em'
            menuProps={[
              {
                label: "Edit",
                onClick: () => this.setState({onEdit: true})
              },
              {
                label: "Remove",
                onClick: this.onDelete.bind(this)
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
          <h4 className="media-heading">{username} <small>&nbsp;{timeSince(timeStamp)}</small></h4>
          <div>
            { onEdit ?
              <EditTextArea
                text={cleanStringWithURL(content)}
                onCancel={() => this.setState({onEdit: false})}
                onEditDone={this.onEditDone.bind(this)}
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
                      onClick={this.onLikeClick.bind(this)}
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
                      userId={userId}
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
            onHide={ () => this.setState({userListModalShown: false}) }
            title="People who liked this reply"
            userId={userId}
            likers={likes}
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
