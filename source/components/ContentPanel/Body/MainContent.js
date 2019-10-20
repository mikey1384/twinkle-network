import React, { useMemo } from 'react';
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
import Link from 'components/Link';
import { cleanString, stringIsEmpty } from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useContentState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';
import { withRouter } from 'react-router';

MainContent.propTypes = {
  commentsHidden: PropTypes.bool,
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  myId: PropTypes.number,
  onClickSecretAnswer: PropTypes.func.isRequired
};

function MainContent({
  commentsHidden,
  contentId,
  contentType,
  history,
  myId,
  onClickSecretAnswer
}) {
  const {
    requestHelpers: { editContent }
  } = useAppContext();
  const {
    byUser,
    content,
    description,
    hasHqThumb,
    isEditing,
    rootContent,
    rootObj,
    targetObj,
    uploader,
    rewardLevel,
    rootId,
    rootType,
    secretAnswer,
    tags,
    title
  } = useContentState({ contentId, contentType });
  const {
    actions: {
      onAddTags,
      onAddTagToContents,
      onEditContent,
      onLoadTags,
      onSetIsEditing
    }
  } = useContentContext();
  const contentHidden =
    ((targetObj?.subject?.secretAnswer &&
      targetObj?.subject?.uploader.id !== myId) ||
      (rootObj.secretAnswer && rootObj.uploader.id !== myId)) &&
    (!targetObj?.subject?.secretShown && !rootObj.secretShown);
  const subjectId = targetObj?.subject ? targetObj.subject.id : rootObj.id;
  return useMemo(
    () => (
      <ErrorBoundary>
        <div>
          {(contentType === 'video' ||
            (contentType === 'subject' && rootType === 'video' && rootObj)) && (
            <VideoPlayer
              stretch
              rewardLevel={
                contentType === 'subject' ? rootObj.rewardLevel : rewardLevel
              }
              byUser={!!(rootObj.byUser || byUser)}
              onEdit={isEditing}
              title={rootObj.title || title}
              hasHqThumb={
                typeof rootObj.hasHqThumb === 'number'
                  ? rootObj.hasHqThumb
                  : hasHqThumb
              }
              uploader={rootObj.uploader || uploader}
              videoId={contentType === 'video' ? contentId : rootId}
              videoCode={contentType === 'video' ? content : rootObj.content}
              style={{ paddingBottom: '0.5rem' }}
            />
          )}
          {contentType === 'subject' && !rootObj.id && !!rewardLevel && (
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
              rewardLevel={rewardLevel}
            />
          )}
          {(contentType === 'url' || contentType === 'video') && (
            <AlreadyPosted
              style={{ marginTop: '-0.5rem' }}
              uploaderId={(uploader || {}).id}
              contentId={contentId}
              contentType={contentType}
              url={content}
              videoCode={contentType === 'video' ? content : undefined}
            />
          )}
          {contentType === 'video' && (
            <TagStatus
              onAddTags={onAddTags}
              onAddTagToContents={onAddTagToContents}
              onLoadTags={onLoadTags}
              tags={tags || []}
              contentId={contentId}
            />
          )}
          <div
            style={{
              marginTop: '1rem',
              marginBottom:
                contentType !== 'video' && !commentsHidden && '1rem',
              padding: '1rem',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              wordBrea: 'break-word'
            }}
          >
            {!isEditing && (
              <>
                {contentType === 'comment' &&
                  (contentHidden ? (
                    <HiddenComment
                      onClick={() => history.push(`/subjects/${subjectId}`)}
                    />
                  ) : (
                    <div
                      style={{
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      <LongText>{content}</LongText>
                    </div>
                  ))}
                {contentType === 'subject' && (
                  <div
                    style={{
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word'
                    }}
                  >
                    <Link
                      style={{
                        fontWeight: 'bold',
                        fontSize: '2.2rem',
                        color: Color.green(),
                        textDecoration: 'none'
                      }}
                      to={`/subjects/${contentId}`}
                    >
                      Subject:
                    </Link>
                    <p
                      style={{
                        marginTop: '1rem',
                        marginBottom: '1rem',
                        fontWeight: 'bold',
                        fontSize: '2.2rem'
                      }}
                    >
                      {cleanString(title)}
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
                    {!stringIsEmpty(description)
                      ? description
                      : contentType === 'video' || contentType === 'url'
                      ? title
                      : ''}
                  </LongText>
                </div>
                {secretAnswer && (
                  <SecretAnswer
                    answer={secretAnswer}
                    onClick={onClickSecretAnswer}
                    subjectId={contentId}
                    uploaderId={uploader.id}
                  />
                )}
              </>
            )}
            {isEditing && (
              <ContentEditor
                comment={content}
                content={content || rootContent}
                contentId={contentId}
                description={description}
                onDismiss={() =>
                  onSetIsEditing({ contentId, contentType, isEditing: false })
                }
                onEditContent={handleEditContent}
                secretAnswer={secretAnswer}
                style={{
                  marginTop:
                    (contentType === 'video' || contentType === 'subject') &&
                    '1rem'
                }}
                title={title}
                contentType={contentType}
              />
            )}
          </div>
          {!isEditing && contentType === 'url' && (
            <Embedly contentId={contentId} loadingHeight="30rem" />
          )}
          {contentType === 'subject' && !!rewardLevel && !!rootObj.id && (
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
              rewardLevel={rewardLevel}
            />
          )}
        </div>
      </ErrorBoundary>
    ),
    [
      contentHidden,
      commentsHidden,
      content,
      description,
      isEditing,
      rewardLevel,
      rootObj,
      tags,
      title
    ]
  );

  async function handleEditContent(params) {
    const data = await editContent(params);
    onEditContent({ data, contentType, contentId });
  }
}

export default withRouter(MainContent);
