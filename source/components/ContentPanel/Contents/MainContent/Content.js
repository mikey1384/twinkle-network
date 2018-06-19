import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { cleanString, stringIsEmpty } from 'helpers/stringHelpers'
import { Color } from 'constants/css'
import Embedly from 'components/Embedly'
import LongText from 'components/Texts/LongText'
import VideoPlayer from 'components/VideoPlayer'
import ContentEditor from '../ContentEditor'

Content.propTypes = {
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
export default function Content({
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
    <Fragment>
      {(type === 'video' || type === 'discussion') && (
        <VideoPlayer
          stretch
          isStarred={!!(isStarred || rootContentIsStarred)}
          onEdit={isEditing}
          title={contentTitle}
          hasHqThumb={hasHqThumb}
          videoId={rootId}
          videoCode={rootContent}
          style={{ paddingBottom: '0.5rem' }}
        />
      )}
      <div
        style={{
          marginTop: type !== 'question' && '1rem',
          marginBottom: type !== 'video' && '1rem',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBrea: 'break-word',
          fontSize: '1.6rem'
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
            <div
              style={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                marginBottom:
                  type === 'url' || type === 'question' ? '1rem' : '0.5rem'
              }}
            >
              <LongText>
                {!stringIsEmpty(contentDescription)
                  ? contentDescription
                  : type === 'video' || type === 'url'
                    ? contentTitle
                    : ''}
              </LongText>
            </div>
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
              marginTop: (type === 'video' || type === 'discussion') && '1rem'
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
            small
            title={cleanString(contentTitle)}
            url={rootContent}
            id={rootId}
            {...urlRelated}
          />
        )}
    </Fragment>
  )
}
