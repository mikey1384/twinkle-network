import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { loadVideoPage, resetVideoPage } from 'actions/VideoActions';
import Carousel from './Carousel';
import CheckListGroup from 'components/CheckListGroup';

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
    userAnswers: []
  }

  componentWillUnmount() {
    this.props.dispatch(resetVideoPage())
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  render() {
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
        <div
          className="row page-header text-center"
          style={{paddingBottom: '1em'}}
        >
          <h1>
            <span>{this.props.title}</span>
          </h1>
          <small style={{
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            overflow:'hidden',
            lineHeight: 'normal'
          }}>Added by {this.props.uploaderName}</small>
        </div>
        <div className="row container">
          <h2>Description</h2>
          <p dangerouslySetInnerHTML={{__html: this.props.description}}/>
        </div>
        <div className="row container-fluid" style={{paddingTop: '1.5em'}}>
          <div className="row container-fluid">
            <ul className="nav nav-tabs nav-justified" style={{width: '100%'}}>
              <li
                className={watchTabActive ? 'active' : ''}
                style={{cursor: 'pointer'}}
                onClick={ () => this.setState({watchTabActive: true})}
              >
                <a>Watch</a>
              </li>
              <li
                className={watchTabActive ? '' : 'active'}
                style={{cursor: 'pointer'}}
                onClick={ () => this.setState({watchTabActive: false})}
              >
                <a>Questions</a>
              </li>
            </ul>
          </div>
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
                onFinish={this.onFinish.bind(this)}
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
        <div className="row container-fluid">
          <div className="container-fluid">
            <div className="page-header">
              <h3>Comments</h3>
              <div className="container-fluid">
                <div className="row form-group">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Post your thoughts here."
                    style={{
                      height: '92px',
                      overflowY: 'hidden'
                    }}>
                  </textarea>
                </div>
                <div className="row">
                  <button className="btn btn-default btn-sm">Submit</button>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <ul className="media-list">
                <li className="media">There are no comments, yet.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderSlides() {
    const {questions} = this.props;
    const {currentSlide, userAnswers} = this.state;
    let questionIndex = 0;
    return questions.map(question => {
      const filteredChoices = question.choices.filter(choice => {
        return choice === null ? false : true;
      })
      let isCurrentSlide = questionIndex++ === currentSlide ? true : false;
      let choiceIndex = 0;
      const listItems = filteredChoices.map(choice => {
        let isSelectedChoice = choiceIndex++ === userAnswers[currentSlide] ? true : false;
        return {
          label: choice,
          checked: isCurrentSlide && isSelectedChoice ? true : false
        }
      })
      return (
        <div key={questionIndex}>
          <div>
            <h3 style={{marginTop: '1rem'}}>{question.title}</h3>
          </div>
          <CheckListGroup
            listItems={listItems}
            inputType="radio"
            name="questions"
            onSelect={this.onSelect.bind(this)}
          />
        </div>
      )
    })
  }

  onSlide(index) {
    this.setState({currentSlide: index})
  }

  onFinish() {
    console.log("finished");
  }

  onSelect(index) {
    let userAnswers = this.state.userAnswers;
    userAnswers[this.state.currentSlide] = index;
    this.setState({userAnswers}, () => {
      console.log(this.state.userAnswers)
    })
  }
}
