import React, { Component } from 'react';
import Likers from 'components/Likers';

export default class VideoLikeInterface extends Component {
  render() {
    const { likes } = this.props;
    return (
      <div>
        <div
          className="text-center"
          style={{marginTop: '4em'}}
        >
          <button
            className="btn btn-info"
            style={{
              fontSize: '3rem'
            }}
            onClick={ () => this.props.onLikeClick() }
            disabled={this.props.userId === null}
          >
            <span className="glyphicon glyphicon-thumbs-up"></span>
            { this.renderLikeButtonText(likes) }
          </button>
        </div>
        <div
          className="text-center"
          style={{marginTop: '1em'}}
        >
          <Likers
            userId={this.props.userId}
            likes={likes}
            onLinkClick={this.props.showLikerList}
            target="video"
          />
        </div>
      </div>
    )
  }

  renderLikeButtonText(likes) {
    let text = " Like";
    if (likes) {
      for (let i = 0; i < likes.length; i++) {
        if(likes[i].userId == this.props.userId) text = " Liked!"
      }
    }
    return text;
  }
}
