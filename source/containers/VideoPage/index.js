import React, { useEffect, useRef, useState } from 'react';
import { useContentObj } from 'helpers/hooks';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  changeByUserStatusForThumbs,
  editVideoThumbs,
  likeVideo,
  setDifficulty
} from 'redux/actions/VideoActions';
import Carousel from 'components/Carousel';
import Button from 'components/Button';
import Loading from 'components/Loading';
import VideoPlayer from 'components/VideoPlayer';
import NotFound from 'components/NotFound';
import CheckListGroup from 'components/CheckListGroup';
import PageTab from './PageTab';
import Comments from 'components/Comments';
import Details from './Details';
import NavMenu from './NavMenu';
import ResultModal from './Modals/ResultModal';
import QuestionsBuilder from './QuestionsBuilder';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { fetchedVideoCodeFromURL, stringIsEmpty } from 'helpers/stringHelpers';
import queryString from 'query-string';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Subjects from 'components/Subjects';
import RewardStatus from 'components/RewardStatus';
import request from 'axios';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import {
  auth,
  fetchPlaylistsContaining,
  handleError,
  loadComments,
  loadSubjects
} from 'helpers/requestHelpers';
import URL from 'constants/URL';

VideoPage.propTypes = {
  authLevel: PropTypes.number,
  canEdit: PropTypes.bool,
  changeByUserStatusForThumbs: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  editVideoThumbs: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  likeVideo: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  setDifficulty: PropTypes.func.isRequired,
  userId: PropTypes.number
};

function VideoPage({
  authLevel,
  canEdit,
  changeByUserStatusForThumbs,
  dispatch,
  editVideoThumbs,
  history,
  likeVideo,
  location: { search },
  match: {
    params: { videoId: initialVideoId }
  },
  setDifficulty,
  userId
}) {
  const [changingPage, setChangingPage] = useState(false);
  const [watchTabActive, setWatchTabActive] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [resultModalShown, setResultModalShown] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [questionsBuilderShown, setQuestionsBuilderShown] = useState(false);
  const [videoId, setVideoId] = useState(initialVideoId);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const mounted = useRef(true);
  const CommentInputAreaRef = useRef(null);
  const {
    contentObj,
    contentObj: {
      byUser,
      childComments: comments,
      commentsLoadMoreButton,
      content,
      description,
      difficulty,
      hasHqThumb,
      likes,
      questions,
      stars,
      subjects,
      subjectsLoadMoreButton,
      tags,
      timeStamp,
      title,
      uploader,
      views
    },
    setContentObj,
    onAddTags,
    onAttachStar,
    onDeleteComment,
    onDeleteSubject,
    onEditComment,
    onEditRewardComment,
    onEditSubject,
    onInitContent,
    onLikeComment,
    onLikeContent,
    onLoadSubjectComments,
    onLoadMoreComments,
    onLoadMoreReplies,
    onLoadMoreSubjects,
    onLoadMoreSubjectComments,
    onLoadMoreSubjectReplies,
    onSetDifficulty,
    onSetSubjectDifficulty,
    onUploadComment,
    onUploadReply,
    onUploadSubject
  } = useContentObj({
    type: 'video',
    contentId: Number(videoId)
  });

  useEffect(() => {
    mounted.current = true;
    setChangingPage(true);
    setVideoLoading(true);
    setVideoUnavailable(false);
    loadVideoPage();
    async function loadVideoPage() {
      try {
        const { data } = await request.get(
          `${URL}/video/page?videoId=${initialVideoId}`
        );
        if (data.notFound) {
          setVideoLoading(false);
          setVideoUnavailable(true);
          return;
        }
        const subjectsObj = await loadSubjects({
          type: 'video',
          contentId: initialVideoId
        });
        const commentsObj = await loadComments({
          id: initialVideoId,
          type: 'video'
        });
        const tags = await fetchPlaylistsContaining({
          videoId: initialVideoId
        });
        if (mounted.current) {
          setVideoId(initialVideoId);
          onInitContent({
            content: {
              ...data,
              tags,
              contentId: Number(initialVideoId),
              childComments: commentsObj?.comments || [],
              commentsLoadMoreButton: commentsObj?.loadMoreButton || false,
              subjects: subjectsObj?.results || [],
              subjectsLoadMoreButton: subjectsObj?.loadMoreButton || false
            }
          });
          setChangingPage(false);
          setVideoLoading(false);
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [initialVideoId]);
  const { playlist: playlistId } = queryString.parse(search);
  const userIsUploader = uploader?.id === userId;
  const userCanEditThis = canEdit && authLevel >= uploader?.authLevel;
  return (
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
        {(videoLoading || videoUnavailable) && (
          <div>
            {videoLoading && <Loading text="Loading Video..." />}
            {videoUnavailable && <NotFound text="Video does not exist" />}
          </div>
        )}
        {!videoLoading && !videoUnavailable && content && (
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
                    difficulty={difficulty}
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
                    style={{ marginTop: !!difficulty && '1rem' }}
                    progressBar
                    showQuestionsBuilder={() => setQuestionsBuilderShown(true)}
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
                        snow
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
                difficulty={difficulty}
                likes={likes}
                likeVideo={handleLikeVideo}
                content={content}
                description={description}
                changeByUserStatus={handleChangeByUserStatus}
                onEditStart={() => setOnEdit(true)}
                onEditCancel={() => setOnEdit(false)}
                onEditFinish={handleEditVideoPage}
                onDelete={() => setConfirmModalShown(true)}
                setDifficulty={handleSetDifficulty}
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
                difficulty={byUser ? 5 : 0}
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
              setSubjectDifficulty={onSetSubjectDifficulty}
              uploadSubject={onUploadSubject}
              contentId={videoId}
              type="video"
              rootDifficulty={difficulty}
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
                  type: 'video',
                  difficulty,
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
  );

  async function handleDeleteVideo() {
    await request.delete(`${URL}/video?videoId=${videoId}`, auth());
    history.push('/videos');
  }

  async function handleEditVideoPage(params) {
    setOnEdit(false);
    try {
      await request.post(`${URL}/video/edit/page`, params, auth());
      const url = fetchedVideoCodeFromURL(params.url);
      setContentObj({
        ...contentObj,
        title: params.title,
        description: params.description,
        content: url
      });
      editVideoThumbs({
        videoId: Number(params.videoId),
        title: params.title,
        url
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  }

  function handleChangeByUserStatus({ contentId, byUser }) {
    setContentObj({
      ...contentObj,
      byUser: byUser
    });
    changeByUserStatusForThumbs({ videoId: Number(contentId), byUser });
  }

  function handleLikeVideo(likes, videoId) {
    onLikeContent({ likes, type: 'video', contentId: videoId });
    likeVideo({ likes, videoId });
  }

  function numberCorrect() {
    const correctAnswers = questions.map(question => {
      return question.correctChoice;
    });
    let numberCorrect = 0;
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] + 1 === correctAnswers[i]) numberCorrect++;
    }
    return numberCorrect;
  }

  function handleSelectChoice(newAnswer) {
    if (typeof userAnswers[currentSlide] === 'number') {
      return setUserAnswers(
        userAnswers.map((answer, index) => {
          return index === currentSlide ? newAnswer : answer;
        })
      );
    }
    const newAnswers = [...userAnswers];
    newAnswers[currentSlide] = newAnswer;
    setUserAnswers(newAnswers);
  }

  function handleRenderSlides() {
    return questions.map((question, index) => {
      const filteredChoices = question.choices.filter(choice => !!choice);
      let isCurrentSlide = index === currentSlide;
      const listItems = filteredChoices.map((choice, index) => {
        let isSelectedChoice = index === userAnswers[currentSlide];
        return {
          label: choice,
          checked: isCurrentSlide && isSelectedChoice
        };
      });
      return (
        <div key={index}>
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

  function handleSetDifficulty({ contentId, difficulty }) {
    onSetDifficulty({ contentId, difficulty });
    setDifficulty({ videoId: Number(contentId), difficulty });
  }

  async function handleUploadQuestions(questions) {
    const data = {
      videoId,
      questions: questions.map(question => {
        const choices = question.choices.filter(choice => {
          return choice.label && !stringIsEmpty(choice.label);
        });
        return {
          videoId,
          title: question.title,
          correctChoice: (() => {
            let correctChoice = 0;
            for (let i = 0; i < choices.length; i++) {
              if (choices[i].checked) correctChoice = i + 1;
            }
            return correctChoice;
          })(),
          choice1: choices[0].label,
          choice2: choices[1].label,
          choice3: choices[2]?.label,
          choice4: choices[3]?.label,
          choice5: choices[4]?.label,
          creator: userId
        };
      })
    };
    try {
      await request.post(`${URL}/video/questions`, data, auth());
      const questions = data.questions.map(question => {
        return {
          title: question.title,
          choices: [
            question.choice1,
            question.choice2,
            question.choice3,
            question.choice4,
            question.choice5
          ],
          correctChoice: question.correctChoice
        };
      });
      setContentObj({
        ...contentObj,
        questions
      });
      setQuestionsBuilderShown(false);
      setCurrentSlide(0);
      setUserAnswers([]);
    } catch (error) {
      handleError(error, dispatch);
    }
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canEdit: state.UserReducer.canEdit,
    userType: state.UserReducer.userType,
    userId: state.UserReducer.userId
  }),
  dispatch => ({
    dispatch,
    changeByUserStatusForThumbs: params =>
      dispatch(changeByUserStatusForThumbs(params)),
    editVideoThumbs: params => dispatch(editVideoThumbs(params)),
    likeVideo: params => dispatch(likeVideo(params)),
    setDifficulty: params => dispatch(setDifficulty(params))
  })
)(VideoPage);
