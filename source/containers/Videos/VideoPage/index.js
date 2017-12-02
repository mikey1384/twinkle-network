import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  editVideoPageAsync,
  deleteVideoAsync,
  uploadQuestionsAsync,
  likeVideoAsync,
  resetVideoPage,
  loadVideoPageAsync
} from 'redux/actions/VideoActions'
import Carousel from 'components/Carousel'
import Button from 'components/Button'
import Loading from 'components/Loading'
import VideoPlayer from 'components/VideoPlayer'
import NotFound from 'components/NotFound'
import ChoiceListGroup from './ChoiceListGroup'
import PageTab from './PageTab'
import Comments from './Comments'
import Description from './Description'
import RightMenu from './RightMenu'
import ResultModal from './Modals/ResultModal'
import QuestionsBuilder from './QuestionsBuilder'
import ConfirmModal from 'components/Modals/ConfirmModal'
import {stringIsEmpty} from 'helpers/stringHelpers'
import queryString from 'query-string'
import ExecutionEnvironment from 'exenv'

class VideoPage extends Component {
  static propTypes = {
    content: PropTypes.string,
    deleteVideo: PropTypes.func.isRequired,
    description: PropTypes.string,
    editVideoPage: PropTypes.func.isRequired,
    hasHqThumb: PropTypes.number,
    history: PropTypes.object.isRequired,
    isStarred: PropTypes.bool,
    likes: PropTypes.array,
    likeVideo: PropTypes.func.isRequired,
    loadVideoPage: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    questions: PropTypes.array,
    resetVideoPage: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    title: PropTypes.string,
    uploaderId: PropTypes.number,
    uploaderName: PropTypes.string,
    uploadQuestions: PropTypes.func.isRequired,
    userId: PropTypes.number,
    videoUnavailable: PropTypes.bool,
    videoLoading: PropTypes.bool,
    videoViews: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      watchTabActive: true,
      currentSlide: 0,
      userAnswers: [],
      resultModalShown: false,
      editModalShown: false,
      confirmModalShown: false,
      onEdit: false,
      questionsBuilderShown: false
    }
    this.onDescriptionEditFinish = this.onDescriptionEditFinish.bind(this)
    this.onSlide = this.onSlide.bind(this)
    this.onQuestionsFinish = this.onQuestionsFinish.bind(this)
    this.onQuestionsSubmit = this.onQuestionsSubmit.bind(this)
    this.numberCorrect = this.numberCorrect.bind(this)
    this.onVideoDelete = this.onVideoDelete.bind(this)
    this.onSelectChoice = this.onSelectChoice.bind(this)
  }

  componentDidMount() {
    const {history, match: {params}, loadVideoPage} = this.props
    if (history.action === 'POP') loadVideoPage(params.videoId)
  }

  componentWillReceiveProps(nextProps) {
    const {loadVideoPage, match: {params}} = this.props
    if (ExecutionEnvironment.canUseDOM && nextProps.match.params.videoId !== params.videoId) {
      loadVideoPage(nextProps.match.params.videoId)
    }
  }

  componentWillUnmount() {
    this.props.resetVideoPage()
  }

  render() {
    const {
      hasHqThumb, isStarred, uploaderId, uploaderName, description, likeVideo, userId, videoUnavailable, videoLoading,
      content, title, timeStamp, questions = [], likes = [], location: {search}, videoViews,
      match: {params: {videoId}}
    } = this.props
    const {
      watchTabActive,
      questionsBuilderShown,
      resultModalShown,
      confirmModalShown,
      currentSlide,
      onEdit
    } = this.state
    const youtubeIframeContainerClassName = watchTabActive ?
      'embed-responsive embed-responsive-16by9' : 'video-container-fixed-left'
    const youtubeIframeClassName = watchTabActive ?
      'embed-responsive-item' : 'video-fixed-left'

    const {playlist: playlistId} = queryString.parse(search)

    return (
      <div className="container-fluid">
        <div className="col-xs-8">
          {videoLoading && <Loading text="Loading Video..." />}
          {videoUnavailable && <NotFound text="Video does not exist" />}
          {!videoUnavailable && !!content &&
            <div
              style={{
                backgroundColor: '#fff',
                marginBottom: '2em',
                paddingRight: '1em',
                paddingLeft: '1em'
              }}
            >
              <div style={{paddingTop: '1.5em'}}>
                <PageTab
                  questions={questions}
                  watchTabActive={watchTabActive}
                  onWatchTabClick={() => this.setState({watchTabActive: true})}
                  onQuestionTabClick={() => this.setState({watchTabActive: false})}
                />
                <div style={{paddingTop: '2em'}}>
                  {!questionsBuilderShown &&
                    <div>
                      <VideoPlayer
                        autoplay
                        isStarred={isStarred}
                        key={videoId}
                        hasHqThumb={hasHqThumb}
                        onEdit={onEdit}
                        small={!watchTabActive}
                        videoId={videoId}
                        videoCode={content}
                        title={title}
                        containerClassName={`${youtubeIframeContainerClassName}`}
                        className={`${youtubeIframeClassName}`}
                      />
                    </div>
                  }
                  {!watchTabActive && questions.length > 0 &&
                    <Carousel
                      progressBar
                      showQuestionsBuilder={() => this.setState({questionsBuilderShown: true})}
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
                  }
                  {!watchTabActive && questions.length === 0 &&
                    <div>
                      <div style={{textAlign: 'center'}}>
                        <p>There are no questions yet.</p>
                        {userId === uploaderId &&
                          <Button
                            className="btn btn-default"
                            style={{marginTop: '1em'}}
                            onClick={() => this.setState({questionsBuilderShown: true})}
                          >Add Questions</Button>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
              <Description
                isStarred={isStarred}
                likes={likes}
                likeVideo={likeVideo}
                videoId={videoId}
                content={content}
                title={title}
                timeStamp={timeStamp}
                uploaderName={uploaderName}
                description={description}
                uploaderId={uploaderId}
                userId={userId}
                onEditStart={() => this.setState({onEdit: true})}
                onEditCancel={() => this.setState({onEdit: false})}
                onEditFinish={this.onDescriptionEditFinish}
                onDelete={() => this.setState({confirmModalShown: true})}
                videoViews={videoViews}
              />
              <Comments {...this.props} />
              {resultModalShown &&
                <ResultModal
                  onHide={() => this.setState({resultModalShown: false})}
                  numberCorrect={this.numberCorrect}
                  totalQuestions={questions.length}
                />
              }
              {confirmModalShown &&
                <ConfirmModal
                  title="Remove Video"
                  onHide={() => this.setState({confirmModalShown: false})}
                  onConfirm={this.onVideoDelete}
                />
              }
              {questionsBuilderShown &&
                <QuestionsBuilder
                  questions={questions}
                  title={title}
                  videoCode={content}
                  onSubmit={this.onQuestionsSubmit}
                  onHide={() => this.setState({questionsBuilderShown: false})}
                />
              }
            </div>
          }
        </div>
        <RightMenu
          videoId={videoId}
          playlistId={playlistId}
        />
      </div>
    )
  }

  renderSlides() {
    const {questions} = this.props
    const {currentSlide, userAnswers} = this.state
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
            <h3 style={{marginTop: '1rem'}} dangerouslySetInnerHTML={{__html: question.title}} />
          </div>
          <ChoiceListGroup
            listItems={listItems}
            onSelect={this.onSelectChoice}
          />
        </div>
      )
    })
  }

  numberCorrect() {
    const {userAnswers} = this.state
    const correctAnswers = this.props.questions.map(question => {
      return question.correctChoice
    })
    let numberCorrect = 0
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] + 1 === correctAnswers[i]) numberCorrect++
    }
    return numberCorrect
  }

  onSlide(index) {
    this.setState({currentSlide: index})
  }

  onQuestionsFinish() {
    this.setState({resultModalShown: true})
  }

  onSelectChoice(index) {
    let {userAnswers, currentSlide} = this.state
    userAnswers[currentSlide] = index
    this.setState({userAnswers})
  }

  onDescriptionEditFinish(params, sender) {
    this.setState({onEdit: false})
    return this.props.editVideoPage(params)
  }

  onVideoDelete() {
    const {match: {params: {videoId}}} = this.props
    this.props.deleteVideo({videoId})
  }

  onQuestionsSubmit(questions) {
    const {match: {params: {videoId}}} = this.props
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
    this.props.uploadQuestions(data, () => {
      this.setState({
        questionsBuilderShown: false,
        currentSlide: 0,
        userAnswers: []
      })
    })
  }
}

export default connect(
  state => ({
    ...state.VideoReducer.videoPage,
    isStarred: !!state.VideoReducer.videoPage.isStarred,
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId
  }),
  {
    editVideoPage: editVideoPageAsync,
    deleteVideo: deleteVideoAsync,
    uploadQuestions: uploadQuestionsAsync,
    likeVideo: likeVideoAsync,
    resetVideoPage,
    loadVideoPage: loadVideoPageAsync
  }
)(VideoPage)
