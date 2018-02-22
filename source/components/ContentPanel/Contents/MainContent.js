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
      {(type === 'video' || type === 'discussion') && (
        <VideoPlayer
          isStarred={!!(isStarred || rootContentIsStarred)}
          onEdit={isEditing}
          title={contentTitle}
          hasHqThumb={hasHqThumb}
          videoId={rootId}
          videoCode={rootContent}
        />
      )}
      {!isEditing && (
        <div
          className="content"
          style={{
            marginTop: type !== 'video' && type !== 'discussion' && 0,
            marginBottom: type !== 'video' && '1rem'
          }}
        >
          {type === 'comment' && (
            <div
              style={{
                wordBreak: 'break-word'
              }}
            >
              <LongText>{content}</LongText>
            </div>
          )}
          {type === 'question' && (
            <div className="question">
              <span style={{ color: Color.green() }}>Question: </span>
              <span style={{ color: Color.darkGray() }}>
                {cleanString(content)}
              </span>
            </div>
          )}
          {(type === 'url' || type === 'question') && (
            <div
              style={{
                wordBreak: 'break-word'
              }}
            >
              {contentDescription && contentDescription !== 'No description' ? (
                <LongText>{contentDescription || ''}</LongText>
              ) : type === 'url' ? (
                <div>{contentTitle}</div>
              ) : null}
            </div>
          )}
          {type === 'discussion' && (
            <div>
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  marginBottom: '1.5rem',
                  color: Color.green()
                }}
              >
                Discuss:
              </p>
              <p>{cleanString(contentTitle)}</p>
            </div>
          )}
          {type === 'video' && (
            <div
              style={{
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
          {type === 'discussion' &&
            contentDescription && (
              <div
                style={{
                  wordBreak: 'break-word'
                }}
              >
                <LongText>{contentDescription}</LongText>
              </div>
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
      {type === 'comment' &&
        rootType === 'url' && (
          <Embedly
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
