import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'components/Carousel';
import Button from 'components/Button';
import VideoPlayer from 'components/VideoPlayer';
import NotFound from 'components/NotFound';
import CheckListGroup from 'components/CheckListGroup';
import Comments from 'components/Comments';
import ResultModal from './Modals/ResultModal';
import QuestionsBuilder from './QuestionsBuilder';
import ConfirmModal from 'components/Modals/ConfirmModal';
import request from 'axios';
import URL from 'constants/URL';
import queryString from 'query-string';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Subjects from 'components/Subjects';
import RewardStatus from 'components/RewardStatus';
import Loading from 'components/Loading';
import Details from './Details';
import NavMenu from './NavMenu';
import PageTab from './PageTab';
import { fetchedVideoCodeFromURL } from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import {
  useAppContext,
  useContentContext,
  useHomeContext,
  useViewContext,
  useExploreContext
} from '../../contexts';

VideoPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default function VideoPage({
  history,
  location: { search },
  match: {
    params: { videoId: initialVideoId }
  }
}) {
  const videoId = Number(initialVideoId);
  const [changingPage, setChangingPage] = useState(false);
  const [watchTabActive, setWatchTabActive] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [resultModalShown, setResultModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [questionsBuilderShown, setQuestionsBuilderShown] = useState(false);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const mounted = useRef(true);
  const CommentInputAreaRef = useRef(null);

  const {
    profile: {
      actions: { onDeleteFeed: onDeleteProfileFeed }
    },
    user: {
      state: { authLevel, canEdit, userId }
    },
    requestHelpers: {
      deleteContent,
      editContent,
      fetchPlaylistsContaining,
      loadComments,
      loadSubjects,
      uploadQuestions
    }
  } = useAppContext();
  const {
    actions: {
      onChangeVideoByUserStatus,
      onDeleteVideo,
      onEditVideoThumbs,
      onLikeVideo
    }
  } = useExploreContext();
  const {
    actions: { onDeleteFeed: onDeleteHomeFeed }
  } = useHomeContext();
  const {
    state,
    actions: {
      onAddTags,
      onAttachStar,
      onDeleteComment,
      onDeleteSubject,
      onEditComment,
      onEditContent,
      onEditRewardComment,
      onEditSubject,
      onInitContent,
      onLikeComment,
      onLikeContent,
      onLoadComments,
      onLoadMoreComments,
      onLoadMoreReplies,
      onLoadMoreSubjectComments,
      onLoadMoreSubjectReplies,
      onLoadMoreSubjects,
      onLoadSubjects,
      onLoadSubjectComments,
      onLoadTags,
      onSetByUserStatus,
      onSetRewardLevel,
      onSetSubjectRewardLevel,
      onSetVideoQuestions,
      onSetThumbRewardLevel,
      onUploadComment,
      onUploadReply,
      onUploadSubject
    }
  } = useContentContext();
  const {
    actions: { onSetExploreSubNav }
  } = useViewContext();

  const contentState = state['video' + videoId] || {};

  const {
    byUser,
    childComments: comments,
    commentsLoaded,
    commentsLoadMoreButton,
    content,
    description,
    rewardLevel,
    hasHqThumb,
    likes,
    loaded,
    questions = [],
    stars,
    subjects,
    subjectsLoaded,
    subjectsLoadMoreButton,
    tags,
    timeStamp,
    title,
    uploader,
    views
  } = contentState;

  useEffect(() => {
    mounted.current = true;
    setCurrentSlide(0);
    setChangingPage(true);
    setWatchTabActive(true);
    setVideoUnavailable(false);
    if (!loaded) {
      handleLoadVideoPage();
    }
    handleLoadTags();
    if (!commentsLoaded) {
      handleLoadComments();
    }
    if (!subjectsLoaded) {
      handleLoadSubjects();
    }
    async function handleLoadVideoPage() {
      try {
        const { data } = await request.get(
          `${URL}/video/page?videoId=${videoId}`
        );
        if (data.notFound) {
          return setVideoUnavailable(true);
        }
        if (mounted.current) {
          onInitContent({
            ...data,
            contentId: Number(videoId),
            contentType: 'video'
          });
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
    async function handleLoadComments() {
      const { comments: loadedComments, loadMoreButton } = await loadComments({
        contentType: 'video',
        contentId: videoId
      });
      onLoadComments({
        comments: loadedComments,
        contentId: videoId,
        contentType: 'video',
        loadMoreButton
      });
    }
    async function handleLoadSubjects() {
      const { results, loadMoreButton } = await loadSubjects({
        contentType: 'video',
        contentId: videoId
      });
      onLoadSubjects({
        contentId: videoId,
        contentType: 'video',
        subjects: results,
        loadMoreButton
      });
      const tags = await fetchPlaylistsContaining({
        videoId
      });
      onInitContent({
        tags
      });
    }
    async function handleLoadTags() {
      const tags = await fetchPlaylistsContaining({ videoId });
      if (mounted.current) {
        onLoadTags({ tags, contentId: videoId, contentType: 'video' });
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [videoId]);
  const { playlist: playlistId } = queryString.parse(search);
  const userIsUploader = uploader?.id === userId;
  const userCanEditThis = canEdit && authLevel >= uploader?.authLevel;

  return useMemo(
    () => (
      <ErrorBoundary
        className={css`
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          margin-top: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 0;
            flex-direction: column;
          }
        `}
      >
        <div
          className={css`
            width: CALC(70% - 1rem);
            height: 100%;
            margin-left: 1rem;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              margin: 0;
            }
          `}
        >
          {(!loaded || videoUnavailable) && (
            <div>
              {!loaded && <Loading text="Loading Video..." />}
              {videoUnavailable && <NotFound text="Video does not exist" />}
            </div>
          )}
          {loaded && !videoUnavailable && content && (
            <div style={{ width: '100%', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '100%',
                  background: '#fff',
                  padding: '1rem',
                  paddingTop: 0
                }}
              >
                <PageTab
                  questions={questions}
                  watchTabActive={watchTabActive}
                  onWatchTabClick={() => setWatchTabActive(true)}
                  onQuestionTabClick={() => setWatchTabActive(false)}
                />
                <div style={{ marginTop: '2rem' }}>
                  {!questionsBuilderShown && (
                    <VideoPlayer
                      rewardLevel={rewardLevel}
                      byUser={!!byUser}
                      key={videoId}
                      hasHqThumb={hasHqThumb}
                      onEdit={onEdit}
                      videoId={videoId}
                      videoCode={content}
                      title={title}
                      uploader={uploader}
                      minimized={!watchTabActive}
                    />
                  )}
                  {!watchTabActive && questions.length > 0 && (
                    <Carousel
                      allowDrag={false}
                      style={{ marginTop: !!rewardLevel && '1rem' }}
                      progressBar
                      showQuestionsBuilder={() =>
                        setQuestionsBuilderShown(true)
                      }
                      userIsUploader={userIsUploader}
                      userCanEditThis={userCanEditThis}
                      slidesToShow={1}
                      slidesToScroll={1}
                      slideIndex={currentSlide}
                      afterSlide={setCurrentSlide}
                      onFinish={() => setResultModalShown(true)}
                    >
                      {handleRenderSlides()}
                    </Carousel>
                  )}
                  {!watchTabActive && questions.length === 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '2rem',
                        height: '15rem'
                      }}
                    >
                      <p>There are no questions yet.</p>
                      {(userIsUploader || userCanEditThis) && (
                        <Button
                          style={{ marginTop: '2rem', fontSize: '2rem' }}
                          skeuomorphic
                          color="darkerGray"
                          onClick={() => setQuestionsBuilderShown(true)}
                        >
                          Add Questions
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#fff',
                  width: '100%'
                }}
              >
                <Details
                  addTags={onAddTags}
                  attachStar={onAttachStar}
                  byUser={!!byUser}
                  changingPage={changingPage}
                  rewardLevel={rewardLevel}
                  likes={likes}
                  onLikeVideo={handleLikeVideo}
                  content={content}
                  description={description}
                  changeByUserStatus={handleChangeByUserStatus}
                  onEditStart={() => setOnEdit(true)}
                  onEditCancel={() => setOnEdit(false)}
                  onEditFinish={handleEditVideoPage}
                  onDelete={() => setConfirmModalShown(true)}
                  onSetRewardLevel={handleSetRewardLevel}
                  stars={stars}
                  tags={tags}
                  title={title}
                  timeStamp={timeStamp}
                  uploader={uploader}
                  userId={userId}
                  videoId={videoId}
                  videoViews={views}
                />
                <RewardStatus
                  contentType="video"
                  rewardLevel={byUser ? 5 : 0}
                  onCommentEdit={onEditRewardComment}
                  style={{
                    fontSize: '1.4rem'
                  }}
                  stars={stars}
                  uploaderName={uploader.username}
                />
              </div>
              <Subjects
                loadMoreButton={subjectsLoadMoreButton}
                subjects={subjects}
                onLoadMoreSubjects={onLoadMoreSubjects}
                onLoadSubjectComments={onLoadSubjectComments}
                onSubjectEditDone={onEditSubject}
                onSubjectDelete={onDeleteSubject}
                setSubjectRewardLevel={onSetSubjectRewardLevel}
                uploadSubject={onUploadSubject}
                contentId={videoId}
                contentType="video"
                rootRewardLevel={rewardLevel}
                commentActions={{
                  attachStar: onAttachStar,
                  editRewardComment: onEditRewardComment,
                  onDelete: onDeleteComment,
                  onEditDone: onEditComment,
                  onLikeClick: onLikeComment,
                  onLoadMoreComments: onLoadMoreSubjectComments,
                  onLoadMoreReplies: onLoadMoreSubjectReplies,
                  onUploadComment,
                  onUploadReply
                }}
              />
              <div
                style={{
                  background: '#fff',
                  padding: '1rem'
                }}
              >
                <p
                  style={{
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    color: Color.darkerGray()
                  }}
                >
                  Comment on this video
                </p>
                <Comments
                  autoExpand
                  comments={comments}
                  inputAreaInnerRef={CommentInputAreaRef}
                  inputTypeLabel={'comment'}
                  loadMoreButton={commentsLoadMoreButton}
                  onAttachStar={onAttachStar}
                  onCommentSubmit={onUploadComment}
                  onDelete={onDeleteComment}
                  onEditDone={onEditComment}
                  onLikeClick={onLikeComment}
                  onLoadMoreComments={onLoadMoreComments}
                  onLoadMoreReplies={onLoadMoreReplies}
                  onReplySubmit={onUploadReply}
                  onRewardCommentEdit={onEditRewardComment}
                  parent={{
                    contentType: 'video',
                    rewardLevel,
                    id: Number(videoId),
                    uploader
                  }}
                  style={{ paddingTop: '1rem' }}
                  userId={userId}
                />
              </div>
              {resultModalShown && (
                <ResultModal
                  onHide={() => setResultModalShown(false)}
                  numberCorrect={numberCorrect}
                  totalQuestions={questions.length}
                />
              )}
              {confirmModalShown && (
                <ConfirmModal
                  title="Remove Video"
                  onHide={() => setConfirmModalShown(false)}
                  onConfirm={handleDeleteVideo}
                />
              )}
              {questionsBuilderShown && (
                <QuestionsBuilder
                  questions={questions}
                  title={title}
                  videoCode={content}
                  onSubmit={handleUploadQuestions}
                  onHide={() => setQuestionsBuilderShown(false)}
                />
              )}
            </div>
          )}
        </div>
        <NavMenu videoId={videoId} playlistId={playlistId} />
      </ErrorBoundary>
    ),
    [
      changingPage,
      contentState,
      watchTabActive,
      currentSlide,
      userAnswers,
      resultModalShown,
      confirmModalShown,
      onEdit,
      playlistId,
      search,
      questionsBuilderShown,
      userIsUploader,
      userCanEditThis,
      videoId,
      videoUnavailable
    ]
  );

  async function handleDeleteVideo() {
    await deleteContent({ id: videoId, contentType: 'video' });
    onDeleteVideo(videoId);
    onDeleteHomeFeed({ contentType: 'video', contentId: videoId });
    onDeleteProfileFeed({ contentType: 'video', contentId: videoId });
    onSetExploreSubNav('');
    history.push('/videos');
  }

  async function handleEditVideoPage(params) {
    setOnEdit(false);
    await editContent(params);
    const url = fetchedVideoCodeFromURL(params.editedUrl);
    onEditContent({
      data: {
        title: params.editedTitle,
        description: params.editedDescription,
        content: url
      }
    });
    onEditVideoThumbs({
      videoId: Number(params.videoId),
      title: params.title,
      url
    });
  }

  function handleChangeByUserStatus({ contentId, contentType, byUser }) {
    onSetByUserStatus({ contentId, contentType, byUser });
    onChangeVideoByUserStatus({ videoId: Number(contentId), byUser });
  }

  function handleLikeVideo(likes, videoId) {
    onLikeContent({ likes, contentType: 'video', contentId: videoId });
    onLikeVideo({ likes, videoId });
  }

  function numberCorrect() {
    const correctAnswers = questions.map(question => question.correctChoice);
    let numberCorrect = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
      if (userAnswers[i] + 1 === correctAnswers[i]) numberCorrect++;
    }
    return numberCorrect;
  }

  function handleRenderSlides() {
    return questions.map((question, questionIndex) => {
      const filteredChoices = question.choices.filter(choice => !!choice);
      const isCurrentSlide = currentSlide === questionIndex;
      const listItems = filteredChoices.map((choice, choiceIndex) => ({
        label: choice,
        checked: isCurrentSlide && userAnswers[currentSlide] === choiceIndex
      }));

      return (
        <div key={questionIndex}>
          <div>
            <h3
              style={{ marginTop: '1rem' }}
              dangerouslySetInnerHTML={{ __html: question.title }}
            />
          </div>
          <CheckListGroup
            inputType="radio"
            listItems={listItems}
            onSelect={handleSelectChoice}
            style={{ marginTop: '1.5rem', paddingRight: '1rem' }}
          />
        </div>
      );
    });
  }

  function handleSelectChoice(newAnswer) {
    setUserAnswers(userAnswers => ({
      ...userAnswers,
      [currentSlide]: newAnswer
    }));
  }

  function handleSetRewardLevel({ contentId, contentType, rewardLevel }) {
    onSetRewardLevel({ contentType, contentId, rewardLevel });
    onSetThumbRewardLevel({ videoId: Number(contentId), rewardLevel });
  }

  async function handleUploadQuestions(questions) {
    const data = await uploadQuestions(questions);
    onSetVideoQuestions({
      contentType: 'video',
      contentId: videoId,
      questions: data
    });
    setQuestionsBuilderShown(false);
    setCurrentSlide(0);
    setUserAnswers({});
  }
}
