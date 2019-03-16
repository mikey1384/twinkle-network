import React from 'react';
import PropTypes from 'prop-types';
import Embedly from 'components/Embedly';
import LongText from 'components/Texts/LongText';
import VideoPlayer from 'components/VideoPlayer';
import ContentEditor from '../ContentEditor';
import Profile from './Profile';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import DifficultyBar from 'components/DifficultyBar';
import AlreadyPosted from 'components/AlreadyPosted';
import TagStatus from 'components/TagStatus';
import { cleanString, stringIsEmpty } from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

MainContent.propTypes = {
  contentObj: PropTypes.object,
  contentId: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onAddTags: PropTypes.func,
  onAddTagToContents: PropTypes.func,
  onEditContent: PropTypes.func.isRequired,
  onEditDismiss: PropTypes.func.isRequired,
  onLoadTags: PropTypes.func,
  rootObj: PropTypes.object,
  urlRelated: PropTypes.object,
  rootType: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default function MainContent({
  contentObj,
  contentId,
  isEditing,
  onAddTags,
  onAddTagToContents,
  onEditContent,
  onEditDismiss,
  onLoadTags,
  rootObj,
  urlRelated,
  rootType,
  type
}) {
  return (
    <ErrorBoundary>
      <div>
        {(type === 'video' || (type === 'subject' && rootType === 'video')) && (
          <VideoPlayer
            stretch
            difficulty={
              type === 'subject' ? rootObj.difficulty : contentObj.difficulty
            }
            byUser={!!(rootObj.byUser || contentObj.byUser)}
            onEdit={isEditing}
            title={rootObj.title || contentObj.title}
            hasHqThumb={
              typeof rootObj.hasHqThumb === 'number'
                ? rootObj.hasHqThumb
                : contentObj.hasHqThumb
            }
            uploader={rootObj.uploader || contentObj.uploader}
            videoId={type === 'video' ? contentObj.id : contentObj.rootId}
            videoCode={type === 'video' ? contentObj.content : rootObj.content}
            style={{ paddingBottom: '0.5rem' }}
          />
        )}
        {(type === 'url' || type === 'video') && (
          <AlreadyPosted
            style={{ marginTop: '-0.5rem' }}
            uploaderId={(contentObj.uploader || {}).id}
            contentId={contentId}
            type={type}
            url={contentObj.content}
            videoCode={type === 'video' ? contentObj.content : undefined}
          />
        )}
        {type === 'subject' &&
          !!contentObj.difficulty &&
          !contentObj.rootObj.id && (
            <DifficultyBar
              difficulty={contentObj.difficulty}
              className={css`
                margin-left: -1px;
                margin-right: -1px;
                @media (max-width: ${mobileMaxWidth}) {
                  margin-left: 0px;
                  margin-right: 0px;
                }
              `}
              style={{
                marginBottom: '-0.5rem'
              }}
            />
          )}
        {type === 'video' && (
          <TagStatus
            onAddTags={onAddTags}
            onAddTagToContents={onAddTagToContents}
            onLoadTags={onLoadTags}
            tags={contentObj.tags || []}
            contentId={contentObj.contentId}
          />
        )}
        <div
          style={{
            marginTop: '1rem',
            marginBottom: type !== 'video' && '1rem',
            padding: '1rem',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBrea: 'break-word'
          }}
        >
          {!isEditing && (
            <>
              {type === 'comment' && (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                >
                  <LongText>{contentObj.content}</LongText>
                </div>
              )}
              {type === 'subject' && (
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
                      fontSize: '2.2rem',
                      marginBottom: '1rem',
                      color: Color.green()
                    }}
                  >
                    Subject:
                  </p>
                  <p
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 'bold',
                      fontSize: '2.2rem'
                    }}
                  >
                    {cleanString(contentObj.title)}
                  </p>
                </div>
              )}
              <div
                style={{
                  marginTop: type === 'url' ? '-1rem' : 0,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  marginBottom:
                    type === 'url' || type === 'subject' ? '1rem' : '0.5rem'
                }}
              >
                <LongText>
                  {!stringIsEmpty(contentObj.description)
                    ? contentObj.description
                    : type === 'video' || type === 'url'
                    ? contentObj.title
                    : ''}
                </LongText>
              </div>
            </>
          )}
          {isEditing && (
            <ContentEditor
              comment={contentObj.content}
              content={contentObj.content || contentObj.rootContent}
              contentId={contentId}
              description={contentObj.description}
              onDismiss={onEditDismiss}
              onEditContent={onEditContent}
              style={{
                marginTop: (type === 'video' || type === 'subject') && '1rem'
              }}
              title={contentObj.title}
              type={type}
            />
          )}
        </div>
        {type === 'comment' && contentObj.rootType === 'user' && (
          <Profile profile={contentObj.rootObj} />
        )}
        {!isEditing && type === 'url' && (
          <Embedly
            title={cleanString(contentObj.title)}
            url={contentObj.content}
            id={contentObj.contentId}
            {...urlRelated}
          />
        )}
        {type === 'subject' &&
          !!contentObj.difficulty &&
          !!contentObj.rootObj.id && (
            <DifficultyBar
              className={css`
                margin-left: -1px;
                margin-right: -1px;
                @media (max-width: ${mobileMaxWidth}) {
                  margin-left: 0px;
                  margin-right: 0px;
                }
              `}
              style={{
                marginBottom: rootType === 'url' ? '-0.5rem' : 0
              }}
              difficulty={contentObj.difficulty}
            />
          )}
        {(type === 'comment' || type === 'subject') && rootType === 'url' && (
          <Embedly
            small
            title={cleanString(rootObj.title)}
            url={rootObj.content}
            id={contentObj.rootId}
            {...urlRelated}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
