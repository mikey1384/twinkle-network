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
import ExecutionEnvironment from 'exenv'

@connect(
  state => ({
    ...state.VideoReducer.videoPage,
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
)
export default class VideoPage extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    loadVideoPage: PropTypes.func,
    resetVideoPage: PropTypes.func,
    content: PropTypes.string,
    title: PropTypes.string,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    questions: PropTypes.array,
    likes: PropTypes.array,
    videoViews: PropTypes.string,
    uploaderId: PropTypes.number,
    uploaderName: PropTypes.string,
    description: PropTypes.string,
    userId: PropTypes.number,
    videoUnavailable: PropTypes.bool,
    videoLoading: PropTypes.bool,
    editVideoPage: PropTypes.func,
    deleteVideo: PropTypes.func,
    uploadQuestions: PropTypes.func,
    likeVideo: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      watchTabActive: true,
      currentSlide: 0,
      userAnswers: [],
      resultModalShown: false,
      editModalShown: false,
      confirmModalShown: false,
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
    const {history, match, loadVideoPage} = this.props
    if (history.action === 'POP') loadVideoPage(match.params.videoId)
  }

  componentWillReceiveProps(nextProps) {
    const {loadVideoPage, match} = this.props
    if (ExecutionEnvironment.canUseDOM && nextProps.match.params.videoId !== match.params.videoId) {
      loadVideoPage(nextProps.match.params.videoId)
    }
  }

  componentWillUnmount() {
    this.props.resetVideoPage()
  }

  render() {
    let {
      uploaderId, uploaderName, description, likeVideo, userId, videoUnavailable, videoLoading,
       content, title, timeStamp, questions = [], likes = [], videoViews, match: {params: {videoId}}
    } = this.props
    videoId = Number(videoId)
    const {
      watchTabActive,
      questionsBuilderShown,
      resultModalShown,
      confirmModalShown,
      currentSlide } = this.state
    const youtubeIframeContainerClassName = watchTabActive ?
    'embed-responsive embed-responsive-16by9' :
    'video-container-fixed-left'
    const youtubeIframeClassName = watchTabActive ?
    'embed-responsive-item' :
    'video-fixed-left'

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
                        key={videoId}
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
                likes={likes}
                likeVideo={likeVideo}
                videoId={videoId}
                title={title}
                timeStamp={timeStamp}
                uploaderName={uploaderName}
                description={description}
                uploaderId={uploaderId}
                userId={userId}
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
    this.props.editVideoPage(params, sender)
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
