import React, {Component, PropTypes} from 'react';
import Button from 'components/Button';
import ContentLink from '../ContentLink';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Textarea from 'react-textarea-autosize';
import InputArea from 'components/InputArea';
import Heading from './Heading';
import MainContent from './MainContent';
import SiblingContent from './SiblingContent';
import MyReply from './MyReply';


export default class FeedPanel extends Component {
  constructor() {
    super()
    this.state = {
      inputBoxShown: false,
      replyLeft: false
    }
  }
  render() {
    const {inputBoxShown, replyLeft} = this.state;
    const {feed, userId} = this.props;
    return (
      <div
        className="panel panel-default"
        style={{borderTop: '#e7e7e7 1px solid'}}
      >
        <Heading
          videoTitle={feed.videoContentTitle}
          type={feed.type}
          action={!!feed.commentId ? 'replied to' : 'commented on'}
          uploader={{name: feed.uploaderName, id: feed.uploaderId}}
          siblingContentUploader={!!feed.siblingContentUploaderName && {name: feed.siblingContentUploaderName, id: feed.siblingContentUploaderId}}
          replyContentUploader={!!feed.replyContentUploaderName && {name: feed.replyContentUploaderName, id: feed.replyContentUploaderId}}
          parentContent={{id: feed.parentContentId, title: feed.videoContentTitle}}
          timeStamp={feed.timeStamp}
        />
        <div className="panel-body">
          {feed.type === 'comment' && !!feed.replyId &&
            <SiblingContent
              isReplyContent={true}
              uploader={{name: feed.replyContentUploaderName, id: feed.replyContentUploaderId}}
              likes={feed.siblingContentLikers}
              content={feed.replyContent}
              myId={userId}
              contentId={feed.replyId}
            />
          }
          {feed.type === 'comment' && !!feed.commentId && !feed.replyId &&
            <SiblingContent
              uploader={{name: feed.siblingContentUploaderName, id: feed.siblingContentUploaderId}}
              likes={feed.siblingContentLikers}
              content={feed.siblingContent}
              myId={userId}
              contentId={feed.commentId}
            />
          }
          <MainContent
            type={feed.type}
            content={feed.content}
            likes={feed.contentLikers}
            myId={userId}
            title={feed.videoContentTitle}
            contentId={feed.contentId}
          />
          {/*
          <MyReply />
          {!replyLeft && (inputBoxShown ?
            <InputArea
              autoFocus
              onSubmit={() => console.log("submitted")}
              rows={4}
              placeholder="Leave a reply here"
            /> :
            <Button
              className="btn btn-primary"
              onClick={() => this.setState({inputBoxShown: true})}
            >
              Leave a reply
            </Button>)
          }
        */}
        </div>
      </div>
    )
  }
}
