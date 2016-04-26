import React, {Component} from 'react';
import { connect } from 'react-redux';
import { editVideoPage, resetVideoPage, deleteVideo } from 'actions/VideoActions';
import Carousel from './Carousel';
import CheckListGroup from 'components/CheckListGroup';
import PageTab from './PageTab';
import Comments from './Comments';
import Description from './Description';
import ResultModal from './Modals/ResultModal';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { push } from 'react-router-redux';

@connect(
  state => ({
    ...state.VideoReducer.videoPage,
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId
  })
)
export default class VideoPage extends Component {
  state = {
    watchTabActive: true,
    currentSlide: 0,
    userAnswers: [],
    resultModalShown: false,
    editModalShown: false,
    confirmModalShown: false
  }

  componentWillUnmount() {
    this.props.dispatch(resetVideoPage())
  }

  render() {
    if (this.props.videoId === 0) {
      return (
        <div>Video Not Found</div>
      )
    }
    const { uploaderId, uploaderName, description, userId, videoId, title } = this.props;
    const { watchTabActive } = this.state;
    const youtubeIframeContainerClassName = watchTabActive ?
    'embed-responsive embed-responsive-16by9' :
    'video-container-fixed-left';
    const youtubeIframeClassName = watchTabActive ?
    'embed-responsive-item' :
    'video-fixed-left';
    const tabPaneClassName = watchTabActive ?
    'container col-sm-8 col-sm-offset-2' :
    'container';

    return (
      <div className="container-fluid">
        <Description
          videoId={videoId}
          title={title}
          uploaderName={uploaderName}
          description={description}
          uploaderId={uploaderId}
          userId={userId}
          onEditFinish={this.onDescriptionEditFinish.bind(this)}
          onDelete={ () => this.setState({confirmModalShown: true}) }
        />
        <div className="row container-fluid" style={{paddingTop: '1.5em'}}>
          <PageTab
            watchTabActive={watchTabActive}
            onWatchTabClick={() => this.setState({watchTabActive: true})}
            onQuestionTabClick={() => this.setState({watchTabActive: false})}
          />
          <div
            className={`tab-pane ${tabPaneClassName}`}
            style={{
              paddingTop: '3em'
            }}
          >
            <div
              className={`${youtubeIframeContainerClassName}`}
            >
              <iframe
                key={this.props.videoId}
                className={`${youtubeIframeClassName}`}
                frameBorder="0"
                allowFullScreen="1"
                title={this.props.title}
                width="640"
                height="360"
                src={`https://www.youtube.com/embed/${this.props.videocode}`}>
              </iframe>
            </div>
            {
              !watchTabActive && this.props.questions.length > 0 &&
              <Carousel
                slidesToShow={1}
                slidesToScroll={1}
                slideIndex={this.state.currentSlide}
                dragging={false}
                afterSlide={this.onSlide.bind(this)}
                onFinish={this.onQuestionsFinish.bind(this)}
              >
                {this.renderSlides()}
              </Carousel>
            }
            {
              !watchTabActive && this.props.questions.length === 0 &&
              <div className="text-center">
                <p>There are no questions yet.</p>
                <button className="btn btn-default"
                  style={{marginTop: '1em'}}
                >Add Questions</button>
              </div>
            }
          </div>
        </div>
        <Comments />
        { this.state.resultModalShown &&
          <ResultModal
            show={true}
            onHide={ () => this.setState({resultModalShown: false}) }
            numberCorrect={this.numberCorrect.bind(this)}
            totalQuestions={this.props.questions.length}
          />
        }
        { this.state.confirmModalShown &&
          <ConfirmModal
            title="Remove Video"
            show={true}
            onHide={ () => this.setState({confirmModalShown: false}) }
            onConfirm={this.onVideoDelete.bind(this)}
          />
        }
      </div>
    )
  }

  renderSlides() {
    const {questions} = this.props;
    const {currentSlide, userAnswers} = this.state;
    return questions.map((question, index) => {
      const filteredChoices = question.choices.filter(choice => {
        return choice === null ? false : true;
      })
      let isCurrentSlide = index === currentSlide ? true : false;
      const listItems = filteredChoices.map((choice, index) => {
        let isSelectedChoice = index === userAnswers[currentSlide] ? true : false;
        return {
          label: choice,
          checked: isCurrentSlide && isSelectedChoice ? true : false
        }
      })
      return (
        <div key={index}>
          <div>
            <h3 style={{marginTop: '1rem'}}>{question.title}</h3>
          </div>
          <CheckListGroup
            style={{marginTop: '2em'}}
            listItems={listItems}
            inputType="radio"
            name="questions"
            onSelect={this.onSelectChoice.bind(this)}
          />
        </div>
      )
    })
  }

  numberCorrect() {
    const { userAnswers } = this.state;
    const correctAnswers = this.props.questions.map(question => {
      return question.correctChoice;
    })
    let numberCorrect = 0;
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] + 1 === correctAnswers[i]) numberCorrect++;
    }
    return numberCorrect;
  }

  onSlide(index) {
    this.setState({currentSlide: index})
  }

  onQuestionsFinish() {
    this.setState({resultModalShown: true})
  }

  onSelectChoice(index) {
    let userAnswers = this.state.userAnswers;
    userAnswers[this.state.currentSlide] = index;
    this.setState({userAnswers})
  }

  onDescriptionEditFinish(params, callback) {
    this.props.dispatch(editVideoPage(params));
    callback();
  }

  onVideoDelete() {
    this.props.dispatch(deleteVideo(this.props.videoId));
    this.props.dispatch(push('/contents'));
  }
}
