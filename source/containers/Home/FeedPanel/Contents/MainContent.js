import React from 'react'
import PropTypes from 'prop-types'
import {cleanString} from 'helpers/stringHelpers'
import {Color} from 'constants/css'
import Embedly from 'components/Embedly'
import LongText from 'components/Texts/LongText'
import VideoPlayer from 'components/VideoPlayer'

MainContent.propTypes = {
  content: PropTypes.string,
  contentDescription: PropTypes.string,
  contentTitle: PropTypes.string,
  hasHqThumb: PropTypes.number,
  isEditing: PropTypes.bool.isRequired,
  rootId: PropTypes.number,
  rootContent: PropTypes.string,
  rootType: PropTypes.string,
  urlRelated: PropTypes.object,
  type: PropTypes.string.isRequired,
  videoViews: PropTypes.string
}
export default function MainContent({
  content, contentDescription, contentTitle, hasHqThumb, isEditing,
  rootId, rootContent, rootType, urlRelated, type, videoViews
}) {
  return (
    <div>
      {!isEditing && type === 'comment' &&
        <span style={{
          fontSize: '1.2em',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          <LongText>{content}</LongText>
        </span>
      }
      {(type === 'video' || type === 'discussion') &&
        <VideoPlayer
          onEdit={isEditing}
          title={contentTitle}
          containerClassName="embed-responsive embed-responsive-16by9"
          className="embed-responsive-item"
          hasHqThumb={hasHqThumb}
          videoId={rootId}
          videoCode={rootContent}
        />
      }
      {!isEditing && type === 'url' && contentDescription && contentDescription !== 'No description' &&
        <div style={{
          fontSize: '1.2em',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          <LongText style={{paddingBottom: '1.5em'}}>{contentDescription || ''}</LongText>
        </div>
      }
      {type === 'url' &&
        <Embedly
          title={cleanString(contentTitle)}
          url={content}
          id={rootId}
          {...urlRelated}
        />
      }
      {!isEditing && type === 'discussion' &&
        <div style={{
          fontSize: '2rem',
          marginTop: '1em'
        }}>
          <p><b style={{color: Color.green}}>Discuss:</b></p>
          <p>{cleanString(contentTitle)}</p>
        </div>
      }
      {!isEditing && type === 'video' && contentDescription && contentDescription !== 'No description' &&
        <div style={{
          marginTop: '1em',
          fontSize: '1.2em',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          <LongText>{contentDescription}</LongText>
        </div>
      }
      {!isEditing && type === 'discussion' && contentDescription &&
        <div style={{
          marginBottom: '1em',
          fontSize: '1.2em',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          <LongText>{contentDescription}</LongText>
        </div>
      }
      {!isEditing && type === 'video' && videoViews > 10 &&
        <span
          className="pull-right"
          style={{
            fontSize: '1.5em',
            marginTop: '1em'
          }}
        >{videoViews} view{`${videoViews > 1 ? 's' : ''}`}</span>
      }
      {type === 'comment' && rootType === 'url' &&
        <Embedly
          style={{marginTop: '2em'}}
          title={cleanString(contentTitle)}
          url={rootContent}
          id={rootId}
          {...urlRelated}
        />
      }
    </div>
  )
}
