import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  attachStar,
  editVideoComment,
  editVideoPage,
  deleteVideo,
  deleteVideoComment,
  editRewardComment,
  uploadQuestions,
  likeVideo,
  likeVideoComment,
  resetVideoPage,
  loadVideoComments,
  loadVideoPage,
  loadMoreComments,
  loadMoreDiscussions,
  loadMoreReplies,
  uploadComment,
  uploadReply
} from 'redux/actions/VideoActions'
import Carousel from 'components/Carousel'
import Button from 'components/Button'
import Loading from 'components/Loading'
import VideoPlayer from 'components/VideoPlayer'
import NotFound from 'components/NotFound'
import CheckListGroup from 'components/CheckListGroup'
import PageTab from './PageTab'
import Comments from 'components/Comments'
import Description from './Description'
import NavMenu from './NavMenu'
import ResultModal from './Modals/ResultModal'
import QuestionsBuilder from './QuestionsBuilder'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { stringIsEmpty } from 'helpers/stringHelpers'
import queryString from 'query-string'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import DiscussionInputArea from './DiscussionInputArea'
import Discussions from './Discussions'
import RewardStatus from 'components/RewardStatus'
import { Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'
import { loadComments } from 'helpers/requestHelpers'

class VideoPage extends Component {
  static propTypes = {
    attachStar: PropTypes.func.isRequired,
    comments: PropTypes.array,
    content: PropTypes.string,
    deleteVideo: PropTypes.func.isRequired,
    deleteVideoComment: PropTypes.func.isRequired,
    description: PropTypes.string,
    discussions: PropTypes.array,
    editRewardComment: PropTypes.func.isRequired,
    editVideoComment: PropTypes.func.isRequired,
    editVideoPage: PropTypes.func.isRequired,
    hasHqThumb: PropTypes.number,
    isStarred: PropTypes.bool,
    likes: PropTypes.array,
    likeVideo: PropTypes.func.isRequired,
    likeVideoComment: PropTypes.func.isRequired,
    loadMoreComments: PropTypes.func.isRequired,
    loadMoreCommentsButton: PropTypes.bool,
    loadMoreDiscussionsButton: PropTypes.bool,
    loadMoreReplies: PropTypes.func.isRequired,
    loadVideoPage: PropTypes.func.isRequired,
    loadVideoComments: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    questions: PropTypes.array,
    resetVideoPage: PropTypes.func.isRequired,
    stars: PropTypes.array,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    uploadComment: PropTypes.func,
    uploadReply: PropTypes.func,
    uploaderAuthLevel: PropTypes.number,
    uploaderId: PropTypes.number,
    uploaderName: PropTypes.string,
    uploadQuestions: PropTypes.func.isRequired,
    userId: PropTypes.number,
    videoUnavailable: PropTypes.bool,
    videoLoading: PropTypes.bool,
    videoViews: PropTypes.string
  }

  constructor({
    match: {
      params: { videoId }
    }
  }) {
    super()
    this.state = {
      watchTabActive: true,
      currentSlide: 0,
      userAnswers: [],
      resultModalShown: false,
      editModalShown: false,
      confirmModalShown: false,
      onEdit: false,
      questionsBuilderShown: false,
      videoId
    }
  }

  async componentDidMount() {
    const {
      match: { params },
      loadVideoComments,
      loadVideoPage
    } = this.props
    await loadVideoPage(params.videoId)
    const data = await loadComments({ id: params.videoId, type: 'video' })
    if (data) loadVideoComments(data)
  }

  async componentDidUpdate(prevProps) {
    const {
      loadVideoPage,
      loadVideoComments,
      match: { params }
    } = this.props
    if (prevProps.match.params.videoId !== params.videoId) {
      await loadVideoPage(params.videoId)
      const data = await loadComments({ id: params.videoId, type: 'video' })
      if (data) loadVideoComments(data)
      return this.setState({
        watchTabActive: true,
        currentSlide: 0,
        userAnswers: [],
        resultModalShown: false,
        editModalShown: false,
        confirmModalShown: false,
        onEdit: false,
        questionsBuilderShown: false,
        videoId: params.videoId
      })
    }
  }

  componentWillUnmount() {
    this.props.resetVideoPage()
  }

  render() {
    const {
      attachStar,
      comments,
      discussions,
      deleteVideoComment,
      editVideoComment,
      editRewardComment,
      loadMoreCommentsButton,
      hasHqThumb,
      isStarred,
      loadMoreDiscussionsButton,
      loadMoreReplies,
      uploaderAuthLevel,
      uploaderId,
      uploaderName,
      description,
      likeVideo,
      likeVideoComment,
      loadMoreComments,
      userId,
      videoUnavailable,
      videoLoading,
      content,
      title,
      timeStamp,
      questions = [],
      likes = [],
      location: { search },
      stars = [],
      uploadComment,
      uploadReply,
      videoViews
    } = this.props
    const {
      watchTabActive,
      questionsBuilderShown,
      resultModalShown,
      confirmModalShown,
      currentSlide,
      onEdit,
      videoId
    } = this.state
    const { playlist: playlistId } = queryString.parse(search)
    return (
      <ErrorBoundary
        className={css`
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          @media (max-width: ${mobileMaxWidth}) {
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
          {!videoLoading &&
            !videoUnavailable &&
            content && (
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
                        autoplay
                        isStarred={isStarred}
                        key={videoId}
                        hasHqThumb={hasHqThumb}
                        onEdit={onEdit}
                        videoId={videoId}
                        videoCode={content}
                        title={title}
                        minimized={!watchTabActive}
                      />
                    )}
                    {!watchTabActive &&
                      questions.length > 0 && (
                        <Carousel
                          style={{ marginTop: isStarred && '1rem' }}
                          progressBar
                          showQuestionsBuilder={() =>
                            this.setState({ questionsBuilderShown: true })
                          }
                          userIsUploader={userId === uploaderId}
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
                    {!watchTabActive &&
                      questions.length === 0 && (
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
                          {userId === uploaderId && (
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
                    background: '#fff'
                  }}
                >
                  <Description
                    isStarred={isStarred}
                    likes={likes}
                    likeVideo={likeVideo}
                    videoId={videoId}
                    content={content}
                    stars={stars}
                    title={title}
                    timeStamp={timeStamp}
                    uploaderName={uploaderName}
                    description={description}
                    uploaderAuthLevel={uploaderAuthLevel}
                    uploaderId={uploaderId}
                    userId={userId}
                    onEditStart={() => this.setState({ onEdit: true })}
                    onEditCancel={() => this.setState({ onEdit: false })}
                    onEditFinish={this.onDescriptionEditFinish}
                    onDelete={() => this.setState({ confirmModalShown: true })}
                    videoViews={videoViews}
                  />
                  <RewardStatus
                    contentType="video"
                    onCommentEdit={editRewardComment}
                    style={{
                      fontSize: '1.4rem'
                    }}
                    stars={stars}
                    uploaderName={uploaderName}
                  />
                </div>
                <DiscussionInputArea videoId={videoId} />
                <Discussions
                  loadMoreDiscussionsButton={loadMoreDiscussionsButton}
                  discussions={discussions}
                  loadMoreDiscussions={loadMoreDiscussions}
                  uploadComment={uploadComment}
                  videoId={videoId}
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
                  <Comments
                    autoExpand
                    comments={comments}
                    inputAreaInnerRef={ref => {
                      this.CommentInputArea = ref
                    }}
                    inputTypeLabel={'comment'}
                    loadMoreButton={loadMoreCommentsButton}
                    loadMoreComments={loadMoreComments}
                    onAttachStar={attachStar}
                    onCommentSubmit={uploadComment}
                    onDelete={deleteVideoComment}
                    onEditDone={editVideoComment}
                    onLikeClick={likeVideoComment}
                    onLoadMoreReplies={loadMoreReplies}
                    onReplySubmit={uploadReply}
                    onRewardCommentEdit={editRewardComment}
                    parent={{ type: 'video', id: Number(videoId) }}
                    style={{ paddingTop: '1rem' }}
                    userId={userId}
                  />
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
                    onConfirm={this.onVideoDelete}
                  />
                )}
                {questionsBuilderShown && (
                  <QuestionsBuilder
                    questions={questions}
                    title={title}
                    videoCode={content}
                    onSubmit={this.onQuestionsSubmit}
                    onHide={() =>
                      this.setState({ questionsBuilderShown: false })
                    }
                  />
                )}
              </div>
            )}
        </div>
        <NavMenu videoId={videoId} playlistId={playlistId} />
      </ErrorBoundary>
    )
  }

  renderSlides = () => {
    const { questions } = this.props
    const { currentSlide, userAnswers } = this.state
    return questions.map((question, index) => {
      const filteredChoices = question.choices.filter(choice => !!choice)
      let isCurrentSlide = index === currentSlide
      const listItems = filteredChoices.map((choice, index) => {
        let isSelectedChoice = index === userAnswers[currentSlide]
        return {
          label: choice,
          checked: isCurrentSlide && isSelectedChoice
        }
      })
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
      )
    })
  }

  numberCorrect = () => {
    const { userAnswers } = this.state
    const correctAnswers = this.props.questions.map(question => {
      return question.correctChoice
    })
    let numberCorrect = 0
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] + 1 === correctAnswers[i]) numberCorrect++
    }
    return numberCorrect
  }

  onSlide = index => {
    this.setState({ currentSlide: index })
  }

  onQuestionsFinish = () => {
    this.setState({ resultModalShown: true })
  }

  onSelectChoice = newAnswer => {
    let { currentSlide, userAnswers } = this.state
    if (typeof userAnswers[currentSlide] === 'number') {
      return this.setState(state => ({
        userAnswers: state.userAnswers.map((answer, index) => {
          return index === currentSlide ? newAnswer : answer
        })
      }))
    }
    this.setState(state => {
      const newAnswers = [...state.userAnswers]
      newAnswers[currentSlide] = newAnswer
      return {
        userAnswers: newAnswers
      }
    })
  }

  onDescriptionEditFinish = (params, sender) => {
    this.setState({ onEdit: false })
    return this.props.editVideoPage(params)
  }

  onVideoDelete = () => {
    const {
      match: {
        params: { videoId }
      }
    } = this.props
    this.props.deleteVideo({ videoId })
  }

  onQuestionsSubmit = async questions => {
    const {
      match: {
        params: { videoId }
      },
      uploadQuestions
    } = this.props
    const data = {
      videoId,
      questions: questions.map(question => {
        const choices = question.choices.filter(choice => {
          return choice.label && !stringIsEmpty(choice.label)
        })
        return {
          videoId,
          title: question.title,
          correctChoice: (() => {
            let correctChoice = 0
            for (let i = 0; i < choices.length; i++) {
              if (choices[i].checked) correctChoice = i + 1
            }
            return correctChoice
          })(),
          choice1: choices[0].label,
          choice2: choices[1].label,
          choice3: choices[2] ? choices[2].label : null,
          choice4: choices[3] ? choices[3].label : null,
          choice5: choices[4] ? choices[4].label : null,
          creator: this.props.userId
        }
      })
    }
    if (data) await uploadQuestions(data)
    this.setState({
      questionsBuilderShown: false,
      currentSlide: 0,
      userAnswers: []
    })
  }
}

export default connect(
  state => ({
    ...state.VideoReducer.videoPage,
    isStarred: !!state.VideoReducer.videoPage.isStarred,
    userType: state.UserReducer.userType,
    userId: state.UserReducer.userId
  }),
  {
    attachStar,
    editVideoComment,
    editVideoPage,
    editRewardComment,
    deleteVideo,
    deleteVideoComment,
    uploadQuestions,
    likeVideo,
    likeVideoComment,
    loadMoreComments,
    loadMoreDiscussions,
    loadMoreReplies,
    loadVideoComments,
    resetVideoPage,
    uploadComment,
    uploadReply,
    loadVideoPage
  }
)(VideoPage)
