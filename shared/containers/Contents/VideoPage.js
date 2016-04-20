import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { loadVideoPage, resetVideoPage } from 'actions/VideoActions';
import Carousel from './Carousel';
import CheckListGroup from 'components/CheckListGroup';
import ButtonGroup from 'components/ButtonGroup';

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
    watchTabActive: true
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
    const CarouselDecorators = [{
      component: React.createClass({
        render() {
          return (
            <div
              className="text-center"
            >
              <ButtonGroup
                buttons={[
                  {
                    label: 'Prev',
                    onClick: this.props.previousSlide,
                    buttonClass: 'btn-default'
                  },
                  {
                    label: 'Next',
                    onClick: this.props.nextSlide,
                    buttonClass: 'btn-default'
                  }
                ]}
              />
            </div>
          )
        }
      }),
      position: 'Relative'
    }];

    const choices = [
      {
        label: 'option 1'
      },
      {
        label: 'option 2'
      },
      {
        label: 'option 3'
      },
      {
        label: 'option 4'
      },
      {
        label: 'option 5'
      }
    ]

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
          <p>{this.props.description}</p>
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
              !watchTabActive &&
              <Carousel
                slidesToShow={1}
                slidesToScroll={1}
                decorators={CarouselDecorators}
                dragging={false}
              >
                <div>
                  <div>
                    <h3>Question 1</h3>
                  </div>
                  <CheckListGroup
                    listItems={choices}
                    inputType="radio"
                    name="questions"
                  />
                </div>
                <div>
                  <div>
                    <h3>Question 2</h3>
                  </div>
                  <CheckListGroup
                    listItems={choices}
                    inputType="radio"
                    name="questions"
                  />
                </div>
              </Carousel>
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
}
