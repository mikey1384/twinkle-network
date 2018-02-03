import React from 'react'
import PropTypes from 'prop-types'
import { cleanString } from 'helpers/stringHelpers'
import { Color } from 'constants/css'
import Embedly from 'components/Embedly'
import LongText from 'components/Texts/LongText'
import VideoPlayer from 'components/VideoPlayer'
import ContentEditor from './ContentEditor'

MainContent.propTypes = {
  content: PropTypes.string,
  contentDescription: PropTypes.string,
  contentId: PropTypes.number.isRequired,
  contentTitle: PropTypes.string,
  hasHqThumb: PropTypes.number,
  isEditing: PropTypes.bool.isRequired,
  isStarred: PropTypes.bool,
  onEditContent: PropTypes.func.isRequired,
  onEditDismiss: PropTypes.func.isRequired,
  rootId: PropTypes.number,
  rootContent: PropTypes.string,
  rootContentIsStarred: PropTypes.bool,
  rootType: PropTypes.string,
  urlRelated: PropTypes.object,
  type: PropTypes.string.isRequired
}
export default function MainContent({
  content,
  contentDescription,
  contentId,
  contentTitle,
  hasHqThumb,
  isEditing,
  isStarred,
  onEditContent,
  onEditDismiss,
  rootId,
  rootContent,
  rootContentIsStarred,
  rootType,
  urlRelated,
  type
}) {
  return (
    <div>
      {!isEditing &&
        type === 'comment' && (
          <div
            style={{
              fontSize: '1.2em',
              wordBreak: 'break-word'
            }}
          >
            <LongText>{content}</LongText>
          </div>
        )}
      {(type === 'video' || type === 'discussion') && (
        <VideoPlayer
          isStarred={!!(isStarred || rootContentIsStarred)}
          onEdit={isEditing}
          title={contentTitle}
          containerClassName="embed-responsive embed-responsive-16by9"
          className="embed-responsive-item"
          hasHqThumb={hasHqThumb}
          videoId={rootId}
          videoCode={rootContent}
        />
      )}
      {!isEditing &&
        type === 'question' && (
          <div
            style={{
              fontSize: '2rem'
            }}
          >
            <p>
              <b style={{ color: Color.green }}>Question:</b>
            </p>
            <p>{cleanString(content)}</p>
          </div>
        )}
      {!isEditing &&
        type === 'url' && (
          <div
            style={{
              fontSize: '1.2em',
              wordBreak: 'break-word'
            }}
          >
            {contentDescription && contentDescription !== 'No description' ? (
              <LongText style={{ paddingBottom: '1.5em' }}>
                {contentDescription || ''}
              </LongText>
            ) : (
              <div style={{ paddingBottom: '1.5em' }}>{contentTitle}</div>
            )}
          </div>
        )}
      {isEditing && (
        <ContentEditor
          comment={content}
          content={content || rootContent}
          contentId={contentId}
          description={contentDescription}
          onDismiss={onEditDismiss}
          onEditContent={onEditContent}
          style={{
            marginTop: (type === 'video' || type === 'discussion') && '1em'
          }}
          title={contentTitle}
          type={type}
        />
      )}
      {!isEditing &&
        type === 'discussion' && (
          <div
            style={{
              fontSize: '2rem',
              marginTop: '1em'
            }}
          >
            <p>
              <b style={{ color: Color.green }}>Discuss:</b>
            </p>
            <p>{cleanString(contentTitle)}</p>
          </div>
        )}
      {!isEditing &&
        type === 'video' && (
          <div
            style={{
              marginTop: '1em',
              fontSize: '1.2em',
              wordBreak: 'break-word'
            }}
          >
            <LongText>
              {contentDescription && contentDescription !== 'No description'
                ? contentDescription
                : contentTitle}
            </LongText>
          </div>
        )}
      {!isEditing &&
        type === 'discussion' &&
        contentDescription && (
          <div
            style={{
              marginBottom: '1em',
              fontSize: '1.2em',
              wordBreak: 'break-word'
            }}
          >
            <LongText>{contentDescription}</LongText>
          </div>
        )}
      {type === 'comment' &&
        rootType === 'url' && (
          <Embedly
            style={{ marginTop: '1.5em' }}
            title={cleanString(contentTitle)}
            url={rootContent}
            id={rootId}
            {...urlRelated}
          />
        )}
      {!isEditing &&
        type === 'url' && (
          <Embedly
            title={cleanString(contentTitle)}
            url={content}
            id={rootId}
            {...urlRelated}
          />
        )}
    </div>
  )
}
