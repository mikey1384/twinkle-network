import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  changeByUserStatusForThumbs,
  deleteVideo,
  editVideoThumbs,
  getInitialVideos,
  likeVideo,
  loadMoreDiscussionComments,
  loadMoreDiscussionReplies,
  loadMoreReplies,
  setDiscussionDifficulty,
  uploadComment,
  uploadReply
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
import Discussions from 'components/Discussions';
import RewardStatus from 'components/RewardStatus';
import request from 'axios';
import { URL } from 'constants/URL';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import {
  auth,
  handleError,
  loadComments,
  loadDiscussions
} from 'helpers/requestHelpers';

class VideoPage extends Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    changeByUserStatusForThumbs: PropTypes.func.isRequired,
    deleteVideo: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    editVideoThumbs: PropTypes.func.isRequired,
    getInitialVideos: PropTypes.func.isRequired,
    likeVideo: PropTypes.func.isRequired,
    loadMoreDiscussionComments: PropTypes.func.isRequired,
    loadMoreDiscussionReplies: PropTypes.func.isRequired,
    loadMoreReplies: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    setDiscussionDifficulty: PropTypes.func.isRequired,
    uploadComment: PropTypes.func,
    uploadReply: PropTypes.func,
    userId: PropTypes.number
  };

  constructor({
    match: {
      params: { videoId }
    }
  }) {
    super();
    this.state = {
      changingPage: false,
      commentsLoaded: false,
      watchTabActive: true,
      currentSlide: 0,
      userAnswers: [],
      resultModalShown: false,
      editModalShown: false,
      confirmModalShown: false,
      onEdit: false,
      questionsBuilderShown: false,
      videoId,
      contentObj: {
        authLevel: undefined,
        byUser: undefined,
        comments: [],
        content: undefined,
        description: undefined,
        difficulty: undefined,
        discussions: [],
        hasHqThumb: undefined,
        likes: [],
        loadMoreCommentsButton: false,
        loadMoreDiscussionsButton: false,
        questions: [],
        tags: [],
        stars: [],
        timeStamp: undefined,
        title: undefined,
        uploader: undefined,
        videoLoading: true,
        videoUnavailable: false,
        views: undefined
      }
    };
  }

  mounted = false;

  async componentDidMount() {
    const {
      match: { params }
    } = this.props;
    this.mounted = true;
    await this.loadVideoPage(params.videoId);
    const discussionsObj = await loadDiscussions({
      type: 'video',
      contentId: params.videoId
    });
    this.loadVideoDiscussions(discussionsObj);
    const comments = await loadComments({ id: params.videoId, type: 'video' });
    if (this.mounted) {
      if (comments) this.loadVideoComments(comments);
      this.setState({ commentsLoaded: true });
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      match: { params }
    } = this.props;
    if (prevProps.match.params.videoId !== params.videoId) {
      this.setState({ changingPage: true });
      await this.loadVideoPage(params.videoId);
      const discussionsObj = await loadDiscussions({
        type: 'video',
        contentId: params.videoId
      });
      this.loadVideoDiscussions(discussionsObj);
      const data = await loadComments({ id: params.videoId, type: 'video' });
      if (this.mounted) {
        this.loadVideoComments(data);
        return this.setState({
          changingPage: false,
          commentsLoaded: true,
          watchTabActive: true,
          currentSlide: 0,
          userAnswers: [],
          resultModalShown: false,
          editModalShown: false,
          confirmModalShown: false,
          onEdit: false,
          questionsBuilderShown: false,
          videoId: params.videoId
        });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      canEdit,
      loadMoreDiscussionComments,
      loadMoreDiscussionReplies,
      loadMoreReplies,
      setDiscussionDifficulty,
      userId,
      location: { search },
      uploadComment,
      uploadReply
    } = this.props;
    const {
      changingPage,
      watchTabActive,
      questionsBuilderShown,
      resultModalShown,
      commentsLoaded,
      confirmModalShown,
      currentSlide,
      onEdit,
      videoId,
      contentObj: {
        authLevel,
        byUser,
        comments,
        content,
        description,
        difficulty,
        discussions,
        hasHqThumb,
        likes,
        loadMoreCommentsButton,
        loadMoreDiscussionsButton,
        questions,
        tags,
        stars,
        timeStamp,
        title,
        uploader,
        videoLoading,
        videoUnavailable,
        views
      }
    } = this.state;
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
                  onWatchTabClick={() =>
                    this.setState({ watchTabActive: true })
                  }
                  onQuestionTabClick={() =>
                    this.setState({ watchTabActive: false })
                  }
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
                      style={{ marginTop: !!difficulty && '1rem' }}
                      progressBar
                      showQuestionsBuilder={() =>
                        this.setState({ questionsBuilderShown: true })
                      }
                      userIsUploader={userIsUploader}
                      userCanEditThis={userCanEditThis}
                      slidesToShow={1}
                      slidesToScroll={1}
                      slideIndex={currentSlide}
                      dragging={false}
                      afterSlide={this.onSlide}
                      onFinish={this.onQuestionsFinish}
                    >
                      {this.renderSlides()}
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
                          success
                          filled
                          onClick={() =>
                            this.setState({ questionsBuilderShown: true })
                          }
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
                  attachStar={this.attachStar}
                  byUser={!!byUser}
                  changingPage={changingPage}
                  difficulty={difficulty}
                  likes={likes}
                  likeVideo={this.likeVideo}
                  videoId={videoId}
                  content={content}
                  stars={stars}
                  tags={tags}
                  title={title}
                  timeStamp={timeStamp}
                  description={description}
                  uploader={uploader}
                  userId={userId}
                  changeByUserStatus={this.changeByUserStatus}
                  onEditStart={() => this.setState({ onEdit: true })}
                  onEditCancel={() => this.setState({ onEdit: false })}
                  onEditFinish={this.editVideoPage}
                  onDelete={() => this.setState({ confirmModalShown: true })}
                  videoViews={views}
                />
                <RewardStatus
                  contentType="video"
                  difficulty={byUser ? 5 : 0}
                  onCommentEdit={this.editRewardComment}
                  style={{
                    fontSize: '1.4rem'
                  }}
                  stars={stars}
                  uploaderName={uploader.username}
                />
              </div>
              <Discussions
                loadMoreButton={loadMoreDiscussionsButton}
                discussions={discussions}
                onLoadMoreDiscussions={this.loadMoreDiscussions}
                onLoadDiscussionComments={this.loadDiscussionComments}
                onDiscussionEditDone={this.editDiscussion}
                onDiscussionDelete={this.deleteDiscussion}
                setDiscussionDifficulty={setDiscussionDifficulty}
                uploadDiscussion={this.uploadDiscussion}
                contentId={videoId}
                type="video"
                rootDifficulty={difficulty}
                commentActions={{
                  attachStar: this.attachStar,
                  editRewardComment: this.editRewardComment,
                  onDelete: this.deleteComment,
                  onEditDone: this.editComment,
                  onLikeClick: this.likeComment,
                  onLoadMoreComments: loadMoreDiscussionComments,
                  onLoadMoreReplies: loadMoreDiscussionReplies,
                  onUploadComment: uploadComment,
                  onUploadReply: uploadReply
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
                    color: Color.darkGray()
                  }}
                >
                  Comment on this video
                </p>
                {commentsLoaded ? (
                  <Comments
                    autoExpand
                    comments={comments}
                    inputAreaInnerRef={ref => {
                      this.CommentInputArea = ref;
                    }}
                    inputTypeLabel={'comment'}
                    loadMoreButton={loadMoreCommentsButton}
                    loadMoreComments={this.loadMoreComments}
                    onAttachStar={this.attachStar}
                    onCommentSubmit={uploadComment}
                    onDelete={this.deleteComment}
                    onEditDone={this.editComment}
                    onLikeClick={this.likeComment}
                    onLoadMoreReplies={loadMoreReplies}
                    onReplySubmit={uploadReply}
                    onRewardCommentEdit={this.editRewardComment}
                    parent={{
                      type: 'video',
                      difficulty,
                      id: Number(videoId),
                      uploader
                    }}
                    style={{ paddingTop: '1rem' }}
                    userId={userId}
                  />
                ) : (
                  <Loading />
                )}
              </div>
              {resultModalShown && (
                <ResultModal
                  onHide={() => this.setState({ resultModalShown: false })}
                  numberCorrect={this.numberCorrect}
                  totalQuestions={questions.length}
                />
              )}
              {confirmModalShown && (
                <ConfirmModal
                  title="Remove Video"
                  onHide={() => this.setState({ confirmModalShown: false })}
                  onConfirm={this.deleteVideo}
                />
              )}
              {questionsBuilderShown && (
                <QuestionsBuilder
                  questions={questions}
                  title={title}
                  videoCode={content}
                  onSubmit={this.uploadQuestions}
                  onHide={() => this.setState({ questionsBuilderShown: false })}
                />
              )}
            </div>
          )}
        </div>
        <NavMenu videoId={videoId} playlistId={playlistId} />
      </ErrorBoundary>
    );
  }

  attachStar = data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        stars:
          data.contentType === 'video'
            ? (state.contentObj.stars || []).concat(data)
            : state.contentObj.stars || [],
        discussions: state.contentObj.discussions.map(discussion => ({
          ...discussion,
          comments: discussion.comments.map(comment => ({
            ...comment,
            stars:
              comment.id === data.contentId
                ? (comment.stars || []).concat(data)
                : comment.stars || [],
            replies: comment.replies.map(reply => ({
              ...reply,
              stars:
                reply.id === data.contentId
                  ? (reply.stars || []).concat(data)
                  : reply.stars || []
            }))
          }))
        })),
        comments: state.contentObj.comments.map(comment => ({
          ...comment,
          stars:
            comment.id === data.contentId
              ? (comment.stars || []).concat(data)
              : comment.stars || [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars:
              reply.id === data.contentId
                ? (reply.stars || []).concat(data)
                : reply.stars || []
          }))
        }))
      }
    }));
  };

  changeByUserStatus = ({ contentId, byUser }) => {
    const { changeByUserStatusForThumbs } = this.props;
    this.setState(state => ({
      ...state,
      contentObj: {
        ...state.contentObj,
        byUser: byUser
      }
    }));
    changeByUserStatusForThumbs({ videoId: Number(contentId), byUser });
  };

  deleteComment = commentId => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        discussions: state.contentObj.discussions.map(discussion => {
          return {
            ...discussion,
            comments: discussion.comments
              ?.filter(comment => comment.id !== commentId)
              .map(comment => ({
                ...comment,
                replies: comment.replies?.filter(
                  reply => reply.id !== commentId
                )
              }))
          };
        }),
        comments: state.contentObj.comments.reduce((prev, comment) => {
          if (comment.id === commentId) return prev;
          return prev.concat([
            {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            }
          ]);
        }, [])
      }
    }));
  };

  deleteDiscussion = discussionId => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        discussions: state.contentObj.discussions.filter(
          discussion => discussion.id !== discussionId
        )
      }
    }));
  };

  deleteVideo = async() => {
    const {
      match: {
        params: { videoId }
      },
      deleteVideo,
      getInitialVideos,
      history
    } = this.props;
    await deleteVideo({ videoId });
    await getInitialVideos();
    history.push('/videos');
  };

  editRewardComment = ({ id, text }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        stars: state.contentObj.stars?.map(star => ({
          ...star,
          rewardComment: star.id === id ? text : star.rewardComment
        })),
        discussions: state.contentObj.discussions.map(discussion => ({
          ...discussion,
          comments: discussion.comments.map(comment => ({
            ...comment,
            stars: comment.stars?.map(star => ({
              ...star,
              rewardComment: star.id === id ? text : star.rewardComment
            })),
            replies: comment.replies?.map(reply => ({
              ...reply,
              stars: reply.stars?.map(star => ({
                ...star,
                rewardComment: star.id === id ? text : star.rewardComment
              }))
            }))
          }))
        })),
        comments: state.contentObj.comments.map(comment => ({
          ...comment,
          stars: comment.stars?.map(star => ({
            ...star,
            rewardComment: star.id === id ? text : star.rewardComment
          })),
          replies: comment.replies.map(reply => ({
            ...reply,
            stars: reply.stars?.map(star => ({
              ...star,
              rewardComment: star.id === id ? text : star.rewardComment
            }))
          }))
        }))
      }
    }));
  };

  editComment = ({ commentId, editedComment }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        discussions: state.contentObj.discussions.map(discussion => ({
          ...discussion,
          comments: discussion.comments.map(comment => ({
            ...comment,
            content: comment.id === commentId ? editedComment : comment.content,
            replies: comment.replies.map(reply => ({
              ...reply,
              content: reply.id === commentId ? editedComment : reply.content
            }))
          }))
        })),
        comments: state.contentObj.comments.map(comment => ({
          ...comment,
          content: comment.id === commentId ? editedComment : comment.content,
          replies: comment.replies.map(reply => ({
            ...reply,
            content: reply.id === commentId ? editedComment : reply.content
          }))
        }))
      }
    }));
  };

  editDiscussion = ({ editedDiscussion, discussionId }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        discussions: state.contentObj.discussions.map(discussion => ({
          ...discussion,
          title:
            discussion.id === discussionId
              ? editedDiscussion.title
              : discussion.title,
          description:
            discussion.id === discussionId
              ? editedDiscussion.description
              : discussion.description
        }))
      }
    }));
  };

  editVideoPage = async params => {
    const { dispatch, editVideoThumbs } = this.props;
    this.setState({ onEdit: false });
    try {
      await request.post(`${URL}/video/edit/page`, params, auth());
      const url = fetchedVideoCodeFromURL(params.url);
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          title: params.title,
          description: params.description,
          content: url
        }
      }));
      editVideoThumbs({ ...params, url });
    } catch (error) {
      handleError(error, dispatch);
    }
  };

  likeComment = ({ commentId, likes }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        discussions: state.contentObj.discussions.map(discussion => {
          return {
            ...discussion,
            comments: discussion.comments.map(comment => {
              return {
                ...comment,
                likes: comment.id === commentId ? likes : comment.likes,
                replies: comment.replies.map(reply => {
                  return {
                    ...reply,
                    likes: reply.id === commentId ? likes : reply.likes
                  };
                })
              };
            })
          };
        }),
        comments: state.contentObj.comments.map(comment => {
          return {
            ...comment,
            likes: comment.id === commentId ? likes : comment.likes,
            replies: comment.replies.map(reply => {
              return {
                ...reply,
                likes: reply.id === commentId ? likes : reply.likes
              };
            })
          };
        })
      }
    }));
  };

  likeVideo = (likes, videoId) => {
    const { likeVideo } = this.props;
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        likes
      }
    }));
    likeVideo({ likes, videoId });
  };

  loadDiscussionComments = ({
    data: { comments, loadMoreButton },
    discussionId
  }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        discussions: state.contentObj.discussions.map(discussion => {
          if (discussion.id === discussionId) {
            return {
              ...discussion,
              comments: comments,
              loadMoreCommentsButton: loadMoreButton
            };
          }
          return discussion;
        })
      }
    }));
  };

  loadMoreComments = ({ comments, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: state.contentObj.comments.concat(comments),
        loadMoreCommentsButton: loadMoreButton
      }
    }));
  };

  loadMoreDiscussions = ({ results, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        discussions: state.contentObj.discussions.concat(results),
        loadMoreDiscussionsButton: loadMoreButton
      }
    }));
  };

  renderSlides = () => {
    const {
      contentObj: { questions },
      currentSlide,
      userAnswers
    } = this.state;
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
            onSelect={this.onSelectChoice}
            style={{ marginTop: '1.5rem', paddingRight: '1rem' }}
          />
        </div>
      );
    });
  };

  loadVideoComments = data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: data.comments,
        loadMoreCommentsButton: data.loadMoreButton
      }
    }));
  };

  loadVideoDiscussions = ({ results, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        discussions: results,
        loadMoreDiscussionsButton: loadMoreButton
      }
    }));
  };

  loadVideoPage = async videoId => {
    if (isNaN(videoId)) {
      return this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          videoUnavailable: true
        }
      }));
    }
    try {
      const { data } = await request.get(
        `${URL}/video/page?videoId=${videoId}`
      );
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          ...data,
          videoLoading: false,
          comments: []
        }
      }));
    } catch (error) {
      console.error(error);
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          videoUnavailable: true
        }
      }));
    }
  };

  numberCorrect = () => {
    const {
      contentObj: { questions },
      userAnswers
    } = this.state;
    const correctAnswers = questions.map(question => {
      return question.correctChoice;
    });
    let numberCorrect = 0;
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] + 1 === correctAnswers[i]) numberCorrect++;
    }
    return numberCorrect;
  };

  onSlide = index => {
    this.setState({ currentSlide: index });
  };

  onQuestionsFinish = () => {
    this.setState({ resultModalShown: true });
  };

  onSelectChoice = newAnswer => {
    let { currentSlide, userAnswers } = this.state;
    if (typeof userAnswers[currentSlide] === 'number') {
      return this.setState(state => ({
        userAnswers: state.userAnswers.map((answer, index) => {
          return index === currentSlide ? newAnswer : answer;
        })
      }));
    }
    this.setState(state => {
      const newAnswers = [...state.userAnswers];
      newAnswers[currentSlide] = newAnswer;
      return {
        userAnswers: newAnswers
      };
    });
  };

  uploadDiscussion = data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        discussions: [data].concat(state.contentObj.discussions)
      }
    }));
  };

  uploadQuestions = async questions => {
    const {
      dispatch,
      match: {
        params: { videoId }
      }
    } = this.props;
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
          creator: this.props.userId
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
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          questions
        },
        questionsBuilderShown: false,
        currentSlide: 0,
        userAnswers: []
      }));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
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
    deleteVideo: params => dispatch(deleteVideo(params)),
    getInitialVideos: () => dispatch(getInitialVideos()),
    likeVideo: params => dispatch(likeVideo(params)),
    loadMoreDiscussionComments,
    loadMoreDiscussionReplies,
    loadMoreReplies,
    setDiscussionDifficulty,
    uploadComment,
    uploadReply
  })
)(VideoPage);
