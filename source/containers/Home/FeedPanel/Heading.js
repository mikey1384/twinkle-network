import PropTypes from 'prop-types'
import React from 'react'
import UserLink from '../UserLink'
import ContentLink from 'components/ContentLink'
import {timeSince} from 'helpers/timeStampHelpers'
import LikeButton from 'components/LikeButton'
import {connect} from 'react-redux'
import {contentFeedLike} from 'redux/actions/FeedActions'
import {Color} from 'constants/css'
import ProfilePic from 'components/ProfilePic'

Heading.propTypes = {
  action: PropTypes.string,
  attachedVideoShown: PropTypes.bool,
  feed: PropTypes.shape({
    rootContentLikers: PropTypes.array,
    rootId: PropTypes.number,
    rootType: PropTypes.string.isRequired,
    timeStamp: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    type: PropTypes.string.isRequired,
    uploaderPicId: PropTypes.number
  }),
  myId: PropTypes.number,
  onLikeClick: PropTypes.func.isRequired,
  onPlayVideoClick: PropTypes.func,
  rootContent: PropTypes.shape({
    content: PropTypes.string
  }).isRequired,
  targetReplyUploader: PropTypes.object,
  targetCommentUploader: PropTypes.object,
  uploader: PropTypes.object
}
function Heading({
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
}) {
  const targetAction = targetReplyUploader ?
    <span><UserLink user={targetReplyUploader} />{"'s reply on"}</span> :
    (targetCommentUploader ?
      <span><UserLink user={targetCommentUploader} />{"'s comment on"}</span> : null
    )
  const userLikedVideo = rootContentLikers.map(liker => liker.userId).indexOf(myId) !== -1
  const contentLabel = rootType === 'url' ? 'link' : rootType
  const spanStyle = {fontSize: '1.4rem'}

  switch (type) {
    case 'video':
      return (
        <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
          <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
          <span className="panel-title pull-left" style={spanStyle}>
            <UserLink user={uploader} /> uploaded a video: <ContentLink content={rootContent} type={rootType} /> <small>{timeStamp ? `(${timeSince(timeStamp)})` : ''}</small>
          </span>
        </div>
      )
    case 'comment':
      return (
        <div className="panel-heading flexbox-container" style={{paddingLeft: '0.8em'}}>
          <ProfilePic size='3' userId={uploader.id} profilePicId={uploaderPicId} />
          <span className="panel-title pull-left col-xs-9" style={{...spanStyle, padding: '0px'}}>
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
                onClick={onPlayVideoClick}
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
          <span className="panel-title pull-left" style={spanStyle}>
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
          <span className="panel-title pull-left" style={spanStyle}>
            <UserLink user={uploader} /> started a <b style={{color: Color.green}}>discussion</b> on {contentLabel}: <ContentLink content={rootContent} type={rootType}/>
            <small>{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small>
          </span>
        </div>
      )
    default:
      return <div className="panpanel-heading flexbox-container">Error</div>
  }
}

export default connect(
  null,
  {onLikeClick: contentFeedLike}
)(Heading)
