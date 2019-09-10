import React from 'react';
import PropTypes from 'prop-types';
import Embedly from 'components/Embedly';
import LongText from 'components/Texts/LongText';
import VideoPlayer from 'components/VideoPlayer';
import ContentEditor from './ContentEditor';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import RewardLevelBar from 'components/RewardLevelBar';
import AlreadyPosted from 'components/AlreadyPosted';
import TagStatus from 'components/TagStatus';
import HiddenComment from 'components/HiddenComment';
import SecretAnswer from 'components/SecretAnswer';
import { cleanString, stringIsEmpty } from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { withRouter } from 'react-router';

MainContent.propTypes = {
  changeSpoilerStatus: PropTypes.func,
  commentsHidden: PropTypes.bool,
  contentObj: PropTypes.object,
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  myId: PropTypes.number,
  onAddTags: PropTypes.func,
  onAddTagToContents: PropTypes.func,
  onClickSecretAnswer: PropTypes.func,
  onEditContent: PropTypes.func.isRequired,
  onEditDismiss: PropTypes.func.isRequired,
  onLoadTags: PropTypes.func,
  rootObj: PropTypes.object,
  urlRelated: PropTypes.object,
  rootType: PropTypes.string,
  secretAnswerShown: PropTypes.bool,
  targetObj: PropTypes.object
};

function MainContent({
  changeSpoilerStatus,
  commentsHidden,
  contentObj,
  contentId,
  history,
  isEditing,
  myId,
  onAddTags,
  onAddTagToContents,
  onClickSecretAnswer,
  onEditContent,
  onEditDismiss,
  onLoadTags,
  rootObj,
  secretAnswerShown,
  targetObj,
  urlRelated,
  rootType,
  contentType
}) {
  return (
    <ErrorBoundary>
      <div>
        {(contentType === 'video' ||
          (contentType === 'subject' && rootType === 'video')) && (
          <VideoPlayer
            stretch
            rewardLevel={
              contentType === 'subject'
                ? rootObj.rewardLevel
                : contentObj.rewardLevel
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
            videoId={
              contentType === 'video' ? contentObj.id : contentObj.rootId
            }
            videoCode={
              contentType === 'video' ? contentObj.content : rootObj.content
            }
            style={{ paddingBottom: '0.5rem' }}
          />
        )}
        {contentType === 'subject' &&
          !contentObj.rootObj.id &&
          !!contentObj.rewardLevel && (
            <RewardLevelBar
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
              rewardLevel={contentObj.rewardLevel}
            />
          )}
        {(contentType === 'url' || contentType === 'video') && (
          <AlreadyPosted
            style={{ marginTop: '-0.5rem' }}
            uploaderId={(contentObj.uploader || {}).id}
            contentId={contentId}
            contentType={contentType}
            url={contentObj.content}
            videoCode={contentType === 'video' ? contentObj.content : undefined}
          />
        )}
        {contentType === 'video' && (
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
            marginBottom: contentType !== 'video' && !commentsHidden && '1rem',
            padding: '1rem',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBrea: 'break-word'
          }}
        >
          {!isEditing && (
            <>
              {contentType === 'comment' && renderComment()}
              {contentType === 'subject' && (
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
                  marginTop: contentType === 'url' ? '-1rem' : 0,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  marginBottom:
                    contentType === 'url' || contentType === 'subject'
                      ? '1rem'
                      : '0.5rem'
                }}
              >
                <LongText>
                  {!stringIsEmpty(contentObj.description)
                    ? contentObj.description
                    : contentType === 'video' || contentType === 'url'
                    ? contentObj.title
                    : ''}
                </LongText>
              </div>
              {contentObj.secretAnswer && (
                <SecretAnswer
                  answer={contentObj.secretAnswer}
                  onClick={onClickSecretAnswer}
                  changeSpoilerStatus={changeSpoilerStatus}
                  shown={secretAnswerShown || contentObj.uploader.id === myId}
                  subjectId={contentObj.id}
                />
              )}
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
              secretAnswer={contentObj.secretAnswer}
              style={{
                marginTop:
                  (contentType === 'video' || contentType === 'subject') &&
                  '1rem'
              }}
              title={contentObj.title}
              contentType={contentType}
            />
          )}
        </div>
        {!isEditing && contentType === 'url' && (
          <Embedly
            title={cleanString(contentObj.title)}
            url={contentObj.content}
            contentId={contentObj.contentId}
            loadingHeight="30rem"
            {...urlRelated}
          />
        )}
        {contentType === 'subject' &&
          !!contentObj.rewardLevel &&
          !!contentObj.rootObj.id && (
            <RewardLevelBar
              className={css`
                margin-left: -1px;
                margin-right: -1px;
                @media (max-width: ${mobileMaxWidth}) {
                  margin-left: 0px;
                  margin-right: 0px;
                }
              `}
              style={{
                marginBottom:
                  isEditing || commentsHidden
                    ? '1rem'
                    : rootType === 'url'
                    ? '-0.5rem'
                    : 0
              }}
              rewardLevel={contentObj.rewardLevel}
            />
          )}
      </div>
    </ErrorBoundary>
  );

  function renderComment() {
    if (
      ((targetObj?.subject?.secretAnswer &&
        targetObj?.subject?.uploader.id !== myId) ||
        (rootObj.secretAnswer && rootObj.uploader.id !== myId)) &&
      !secretAnswerShown
    ) {
      const subjectId = targetObj?.subject ? targetObj.subject.id : rootObj.id;
      return (
        <HiddenComment onClick={() => history.push(`/subjects/${subjectId}`)} />
      );
    }
    return (
      <div
        style={{
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-word'
        }}
      >
        <LongText>{contentObj.content}</LongText>
      </div>
    );
  }
}

export default withRouter(MainContent);
