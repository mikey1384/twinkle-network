import PropTypes from 'prop-types'
import React, {Component} from 'react'
import UserLink from '../UserLink'
import ContentLink from 'components/ContentLink'
import {timeSince} from 'helpers/timeStampHelpers'
import LikeButton from 'components/LikeButton'
import {connect} from 'react-redux'
import {contentFeedLike} from 'redux/actions/FeedActions'
import {Color} from 'constants/css'
import ProfilePic from 'components/ProfilePic'

@connect(
  null,
  {onLikeClick: contentFeedLike}
)
export default class Heading extends Component {
  static propTypes = {
    action: PropTypes.string,
    feed: PropTypes.object,
    uploader: PropTypes.object,
    targetReplyUploader: PropTypes.any,
    targetCommentUploader: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]),
    rootContent: PropTypes.object,
    onPlayVideoClick: PropTypes.func,
    attachedVideoShown: PropTypes.bool,
    myId: PropTypes.number,
    onLikeClick: PropTypes.func
  }

  render() {
    const {
      feed: {
        type,
        rootType,
        uploaderPicId,
        rootId,
        timeStamp,
        rootContentLikers = []
      },
      action,
      attachedVideoShown,
      myId,
      onLikeClick,
      onPlayVideoClick,
      rootContent,
      targetCommentUploader,
      targetReplyUploader,
      uploader
    } = this.props

    let targetAction

    if (targetReplyUploader) {
      targetAction = <span><UserLink user={targetReplyUploader} />{"'s reply on"}</span>
    } else if (targetCommentUploader) {
      targetAction = <span><UserLink user={targetCommentUploader} />{"'s comment on"}</span>
    }
    let userLikedVideo = false
    for (let i = 0; i < rootContentLikers.length; i++) {
      if (rootContentLikers[i].userId === myId) userLikedVideo = true
    }

    const pStyle = {fontSize: '1.4rem'}

    let contentLabel
    switch (rootType) {
      case 'video':
        contentLabel = 'video'
        break
      case 'url':
        contentLabel = 'link'
        break
      default: break
    }

    switch (type) {
      case 'video':
        return (
          <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
            <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
            <span className="panel-title pull-left" style={pStyle}>
              <UserLink user={uploader} /> uploaded a video: <ContentLink content={rootContent} type={rootType} /> <small>{timeStamp ? `(${timeSince(timeStamp)})` : ''}</small>
            </span>
          </div>
        )
      case 'comment':
        return (
          <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
            <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
            <span className="panel-title pull-left col-xs-9" style={{...pStyle, padding: '0px'}}>
              <UserLink user={uploader} /> {action} {targetAction} {contentLabel}: <ContentLink content={rootContent} type={rootType} /> <small>({timeSince(timeStamp)})</small>
            </span>
            {attachedVideoShown ?
              <LikeButton
                small
                style={{
                  marginLeft: 'auto',
                  float: 'right'
                }}
                targetLabel="Video"
                liked={userLikedVideo}
                onClick={() => onLikeClick(rootId, rootType)}
              /> :
              (
                rootType === 'video' && rootContent.content && <a
                  style={{
                    marginLeft: 'auto',
                    float: 'right',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: Color.blue
                  }}
                  onClick={() => onPlayVideoClick()}
                >
                  <div className="video-preview-thumb" style={{width: '7em'}}>
                    <img
                      alt=""
                      style={{width: '7em'}}
                      src={`https://img.youtube.com/vi/${rootContent.content}/mqdefault.jpg`}
                    />
                    <span></span>
                  </div>
                </a>
              )
            }
          </div>
        )
      case 'url':
        return (
          <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
            <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
            <span className="panel-title pull-left" style={pStyle}>
              <UserLink user={uploader} /> shared a link:&nbsp;
              <ContentLink content={rootContent} type={rootType}/>
              <small>{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small>
            </span>
          </div>
        )
      case 'discussion':
        return (
          <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
            <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
            <span className="panel-title pull-left" style={pStyle}>
              <UserLink user={uploader} /> started a <b style={{color: Color.green}}>discussion</b> on {contentLabel}: <ContentLink content={rootContent} type={rootType}/>
              <small>{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small>
            </span>
          </div>
        )
      default:
        return <div className="panpanel-heading flexbox-container">Error</div>
    }
  }
}
