import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  editVideoPageAsync,
  deleteVideoAsync,
  uploadQuestionsAsync,
  uploadVideoCommentAsync,
  uploadVideoReplyAsync,
  likeVideoAsync
} from 'redux/actions/VideoActions';
import Carousel from './Carousel';
import CheckListGroup from 'components/CheckListGroup';
import PageTab from './PageTab';
import VideoLikeInterface from './VideoLikeInterface';
import Comments from './Comments';
import Description from './Description';
import ResultModal from './Modals/ResultModal';
import QuestionsBuilder from './QuestionsBuilder';
import UserListModal from 'components/Modals/UserListModal';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { bindActionCreators } from 'redux';

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
    uploadVideoComment: uploadVideoCommentAsync,
    likeVideo: likeVideoAsync
  }
)
export default class VideoPage extends Component {
  state = {
    watchTabActive: true,
    currentSlide: 0,
    userAnswers: [],
    resultModalShown: false,
    editModalShown: false,
    confirmModalShown: false,
    questionsBuilderShown: false,
    userListModalShown: false
  }

  render() {
    if (this.props.videoId === 0) {
      return (
        <div>Video Not Found</div>
      )
    }
    let {
      uploaderId,
      uploaderName,
      description,
      userId,
      videoId,
      title,
      questions,
      likes,
      comments,
      noComments } = this.props;
    likes = likes || [];
    questions = questions || [];
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
            { !this.state.questionsBuilderShown &&
              <div>
                <div className={`${youtubeIframeContainerClassName}`}>
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
                { watchTabActive &&
                  <VideoLikeInterface
                    userId={userId}
                    likes={likes}
                    onLikeClick={this.onVideoLikeClick.bind(this)}
                    showLikerList={this.showLikerList.bind(this)}
                  />
                }
              </div>
            }
            { !watchTabActive && questions.length > 0 &&
              <Carousel
                showQuestionsBuilder={ () => this.setState({questionsBuilderShown: true})}
                userIsUploader={userId == uploaderId}
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
            { !watchTabActive && questions.length === 0 &&
              <div className="text-center">
                <p>There are no questions yet.</p>
                { userId == uploaderId &&
                  <button
                    className="btn btn-default"
                    style={{marginTop: '1em'}}
                    onClick={ () => this.setState({questionsBuilderShown: true}) }
                  >Add Questions</button>
                }
              </div>
            }
          </div>
        </div>
        <Comments
          {...this.props}
          onSubmit={this.onCommentSubmit.bind(this)}
        />
        { this.state.resultModalShown &&
          <ResultModal
            show={true}
            onHide={ () => this.setState({resultModalShown: false}) }
            numberCorrect={this.numberCorrect.bind(this)}
            totalQuestions={questions.length}
          />
        }
        { this.state.confirmModalShown &&
          <ConfirmModal
            show={true}
            title="Remove Video"
            onHide={ () => this.setState({confirmModalShown: false}) }
            onConfirm={this.onVideoDelete.bind(this)}
          />
        }
        { this.state.questionsBuilderShown &&
          <QuestionsBuilder
            show={true}
            questions={questions}
            title={title}
            videocode={this.props.videocode}
            onSubmit={this.onQuestionsSubmit.bind(this)}
            onHide={ () => this.setState({questionsBuilderShown: false}) }
          />
        }
        { this.state.userListModalShown &&
          <UserListModal
            show={true}
            onHide={ () => this.setState({userListModalShown: false}) }
            title="People who liked this video"
            userId={userId}
            users={likes.map(like => {
              return {
                username: like.username,
                userId: like.userId
              }
            })}
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

  onDescriptionEditFinish(params, sender) {
    this.props.editVideoPage(params, sender);
  }

  onVideoDelete() {
    const { videoId } = this.props;
    this.props.deleteVideo({videoId});
  }

  onQuestionsSubmit(questions) {
    const data = {
      videoId: this.props.videoId,
      questions: questions.map(question => {
        const choices = question.choices.filter(choice => {
          return !choice.label || choice.label === '' ? false : true;
        })
        return {
          videoid: this.props.videoId,
          questiontitle: question.title,
          correctchoice: (() => {
            let correctChoice = 0;
            for (let i = 0; i < choices.length; i ++) {
              if (choices[i].checked) correctChoice = i+1;
            }
            return correctChoice;
          })(),
          choice1: choices[0].label,
          choice2: choices[1].label,
          choice3: choices[2] ? choices[2].label : null,
          choice4: choices[3] ? choices[3].label : null,
          choice5: choices[4] ? choices[4].label : null,
          createdby: this.props.userId
        }
      })
    }
    this.props.uploadQuestions(data, () => {
      this.setState({
        questionsBuilderShown: false,
        currentSlide: 0,
        userAnswers: []
      })
    });
  }

  onCommentSubmit(comment) {
    const { videoId } = this.props;
    this.props.uploadVideoComment(comment, videoId);
  }

  onVideoLikeClick() {
    const { videoId } = this.props;
    this.props.likeVideo(videoId);
  }

  showLikerList() {
    this.setState({userListModalShown: true})
  }
}
