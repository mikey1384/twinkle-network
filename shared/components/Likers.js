import React, { Component } from 'react';

export default class Likers extends Component {
  render() {
    return (
      <div
        {...this.props}
      >
        { this.renderLikers() }
      </div>
    )
  }

  renderLikers() {
    let userLiked = false;
    let totalLikes = 0;
    const { likes, target } = this.props;
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
          let otherLikerName = otherLikes[0] && otherLikes[0].username;
          return (
            <div>
              You and <strong>{ otherLikerName }</strong> like {`this${target ? (' ' + target) : ''}.`}
            </div>
          )
        } else {
          return (
            <div>
              You and <strong><a style={{cursor: 'pointer'}}
                onClick={ () => this.props.onLinkClick() }
              >{ totalLikes } others</a></strong> like {`this${target ? (' ' + target) : ''}.`}
            </div>
          )
        }
      }
      return (
        <div>
          You like {`this${target ? (' ' + target) : ''}.`}
        </div>
      )
    }
    else if (totalLikes > 0) {
      if (totalLikes === 1) {
        const likerName = likes[0].username;
        return (
          <div>
            <strong>{likerName}</strong> likes {`this${target ? (' ' + target) : ''}.`}
          </div>
        )
      } else {
        return (
          <div>
            <strong><a style={{cursor: 'pointer'}}
              onClick={ () => this.props.onLinkClick() }
            >{ totalLikes } people</a></strong> like {`this${target ? (' ' + target) : ''}.`}
          </div>
        )
      }
    }
    else {
      return null;
    }
  }
}
