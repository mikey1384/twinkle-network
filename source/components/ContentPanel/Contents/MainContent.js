import React, { Fragment } from 'react'
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
          stretch
          isStarred={!!(isStarred || rootContentIsStarred)}
          onEdit={isEditing}
          title={contentTitle}
          hasHqThumb={hasHqThumb}
          videoId={rootId}
          videoCode={rootContent}
        />
      )}
      <div
        className="panel__content"
        style={{
          marginTop: type !== 'video' && type !== 'discussion' && 0,
          marginBottom: type !== 'video' && '1rem'
        }}
      >
        {!isEditing && (
          <Fragment>
            {type === 'comment' && (
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
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
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  marginBottom: '1rem'
                }}
              >
                {contentDescription &&
                contentDescription !== 'No description' ? (
                  <LongText>{contentDescription || ''}</LongText>
                ) : type === 'url' ? (
                  <div>{contentTitle}</div>
                ) : null}
              </div>
            )}
            {type === 'discussion' && (
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                <p
                  style={{
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    color: Color.green()
                  }}
                >
                  Discuss:
                </p>
                <h3>{cleanString(contentTitle)}</h3>
              </div>
            )}
            {type === 'video' && (
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
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
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    marginTop: '1rem'
                  }}
                >
                  <LongText>{contentDescription}</LongText>
                </div>
              )}
          </Fragment>
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
      </div>
      {!isEditing &&
        type === 'url' && (
          <Embedly
            title={cleanString(contentTitle)}
            url={content}
            id={rootId}
            {...urlRelated}
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
    </div>
  )
}
