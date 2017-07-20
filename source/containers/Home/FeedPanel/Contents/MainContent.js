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
  rootId: PropTypes.number,
  rootContent: PropTypes.string,
  rootType: PropTypes.string,
  type: PropTypes.string.isRequired,
  videoViews: PropTypes.string
}
export default function MainContent({
  content, contentDescription, contentTitle,
  rootId, rootContent, rootType, type, videoViews
}) {
  return (
    <div>
      {type === 'comment' &&
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
          title={contentTitle}
          containerClassName="embed-responsive embed-responsive-16by9"
          className="embed-responsive-item"
          videoId={rootId}
          videoCode={rootContent}
        />
      }
      {type === 'url' &&
      !!contentDescription && contentDescription !== 'No description' &&
        <div style={{
          fontSize: '1.2em',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          <LongText style={{paddingBottom: '1.5em'}}>{contentDescription || ''}</LongText>
        </div>
      }
      {type === 'url' &&
        <Embedly title={cleanString(contentTitle)} url={content} />
      }
      {type === 'discussion' &&
        <div style={{
          fontSize: '2rem',
          marginTop: '1em'
        }}>
          <p><b style={{color: Color.green}}>Discuss:</b></p>
          <p>{cleanString(contentTitle)}</p>
        </div>
      }
      {type === 'video' &&
      !!contentDescription && contentDescription !== 'No description' &&
        <div style={{
          marginTop: '1em',
          fontSize: '1.2em',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          <LongText>{contentDescription}</LongText>
        </div>
      }
      {type === 'discussion' &&
      !!contentDescription &&
        <div style={{
          marginBottom: '1em',
          fontSize: '1.2em',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          <LongText>{contentDescription}</LongText>
        </div>
      }
      {type === 'video' && videoViews > 10 &&
        <span
          className="pull-right"
          style={{
            fontSize: '1.5em',
            marginTop: '1em'
          }}
        >{videoViews} view{`${videoViews > 1 ? 's' : ''}`}</span>
      }
      {type === 'comment' && rootType === 'url' &&
        <Embedly style={{marginTop: '2em'}} title={cleanString(contentTitle)} url={rootContent} />
      }
    </div>
  )
}
