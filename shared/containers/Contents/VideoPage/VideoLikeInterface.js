import React, { Component } from 'react';

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
          { this.renderPeopleThatLikedText(likes) }
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

  renderPeopleThatLikedText(likes) {
    let userLiked = false;
    let totalLikes = 0;
    if (likes) {
      for (let i = 0; i < likes.length; i ++) {
        if(likes[i].userId == this.props.userId) userLiked = true;
        totalLikes ++;
      }
    }
    if (userLiked) {
      totalLikes --;
      if (totalLikes > 0) {
        if (totalLikes === 1) {
          let otherLikes = likes.filter(like => {
            return (like.userId == this.props.userId) ? false : true;
          })
          let otherLikerName = otherLikes[0].username;
          return (
            <div>
              You and <strong>{ otherLikerName }</strong> like this video.
            </div>
          )
        } else {
          return (
            <div>
              You and <a style={{cursor: 'pointer'}}
                onClick={ () => this.props.showLikerList() }
              >{ totalLikes } others</a> like this video.
            </div>
          )
        }
      }
      return (
        <div>
          You like this video.
        </div>
      )
    }
    else if (totalLikes > 0) {
      if (totalLikes === 1) {
        const likerName = likes[0].username;
        return (
          <div>
            <strong>{likerName}</strong> likes this video.
          </div>
        )
      } else {
        return (
          <div>
            <a style={{cursor: 'pointer'}}
              onClick={ () => this.props.showLikerList() }
            >{ totalLikes } people</a> like this video.
          </div>
        )
      }
    }
    else {
      return null;
    }
  }
}
