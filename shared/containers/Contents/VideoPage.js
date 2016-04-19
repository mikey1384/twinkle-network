import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { loadVideoPage, resetVideoPage } from 'actions/VideoActions';
import YouTube from 'react-youtube';

@connect(
  state => ({
    ...state.VideoReducer.videoPage,
    userType: state.UserReducer.userType,
    isAdmin: state.UserReducer.isAdmin,
    userId: state.UserReducer.userId
  })
)
export default class VideoPage extends Component {
  componentWillUnmount() {
    this.props.dispatch(resetVideoPage())
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  render() {
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
              <li className="active">
                <a>Watch</a>
              </li>
              <li>
                <a>Questions</a>
              </li>
            </ul>
          </div>
          <div
            className="tab-pane col-md-8 col-md-offset-2 container"
            style={{
              paddingTop: '3em'
            }}
          >
            <div
              className="embed-responsive embed-responsive-16by9"
            >
              <YouTube
                className="embed-responsive-item"
                videoId={this.props.videocode}
              />
            </div>
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
