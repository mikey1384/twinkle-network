import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { timeSince } from 'helpers/TimeStampHelper';
import ReplyInputArea from './ReplyInputArea';

export default class Comment extends Component {
  state = {
    replyInputShown: false
  }
  render() {
    const { replyInputShown } = this.state;
    const { comment } = this.props;
    return (
      <li className="media">
        <div className="media-left">
          <a>
            <img
              className="media-object"
              src="/img/default.jpg"
              style={{width: '64px'}}
            />
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">{ comment.posterName } <small>&nbsp;{ timeSince(comment.timeStamp) }</small></h4>
          <div className="container-fluid">
            <div
              className="row"
              style={{paddingBottom: '2em'}}
              dangerouslySetInnerHTML={{__html: comment.content}}
            />
            <div className="row">
              <button
                className="btn btn-default btn-sm"
                onClick={ () => this.setState({replyInputShown: true}) }
              >
                <span className="glyphicon glyphicon-comment"></span> Reply
              </button>
              <button
                className="btn btn-default btn-sm"
                style={{marginLeft: '0.5em'}}
              >
                <span className="glyphicon glyphicon-thumbs-up"></span> Like
              </button>
            </div>
          </div>

          { replyInputShown && <ReplyInputArea /> }
        </div>
      </li>
    )
  }
}
