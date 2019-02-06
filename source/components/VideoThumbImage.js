import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { auth } from 'helpers/requestHelpers';
import request from 'axios';
import { connect } from 'react-redux';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { rewardValue } from 'constants/defaultValues';
import { css } from 'emotion';

const { URL } = process.env;
const API_URL = `${URL}/video`;
const xp = rewardValue.star;

class VideoThumbImage extends Component {
  static propTypes = {
    height: PropTypes.string,
    difficulty: PropTypes.number,
    playIcon: PropTypes.bool,
    src: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  state = {
    xpEarned: false
  };

  mounted = false;

  componentDidMount() {
    const { userId, difficulty } = this.props;
    this.mounted = true;
    if (difficulty && userId) {
      this.checkXpStatus();
    }
  }

  componentDidUpdate(prevProps) {
    const { videoId, difficulty, userId } = this.props;
    const isNewVideo = prevProps.videoId !== videoId;
    const isDifferentUser = userId && userId !== prevProps.userId;
    const isUnstarred = prevProps.difficulty && !difficulty;
    const isLoggedOut = prevProps.userId && !userId;
    if (difficulty) {
      if (isNewVideo || isDifferentUser) {
        this.checkXpStatus();
      }
    }
    if (isUnstarred || isLoggedOut) {
      this.setState({ xpEarned: false });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { src, height = '55%', difficulty, playIcon } = this.props;
    const { xpEarned } = this.state;
    return (
      <div
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          overFlow: 'hidden',
          paddingBottom: height,
          position: 'relative'
        }}
      >
        <img
          alt="Thumbnail"
          src={src}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            margin: 'auto',
            borderBottom: !!xpEarned && `0.8rem solid ${Color.green()}`
          }}
        />
        {playIcon && (
          <a
            className={css`
              position: absolute;
              display: block;
              background: url('/img/play-button-image.png');
              background-size: contain;
              height: 3rem;
              width: 3rem;
              top: 50%;
              left: 50%;
              margin: -1.5rem 0 0 -1.5rem;
            `}
          />
        )}
        {!!difficulty && (
          <div
            style={{
              position: 'absolute',
              padding: '0.1rem 0.5rem',
              background:
                difficulty === 5
                  ? Color.gold()
                  : difficulty === 4
                  ? Color.rose()
                  : difficulty === 3
                  ? Color.orange()
                  : difficulty === 2
                  ? Color.pink()
                  : Color.logoBlue(),
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#fff'
            }}
          >
            {addCommasToNumber(difficulty * xp)} XP
          </div>
        )}
      </div>
    );
  }

  checkXpStatus = async() => {
    const { videoId } = this.props;
    const authorization = auth();
    const authExists = !!authorization.headers.authorization;
    if (authExists) {
      try {
        const {
          data: { xpEarned }
        } = await request.get(`${API_URL}/xpEarned?videoId=${videoId}`, auth());
        if (this.mounted) this.setState(() => ({ xpEarned }));
      } catch (error) {
        console.error(error.response || error);
      }
    }
  };
}

export default connect(state => ({ userId: state.UserReducer.userId }))(
  VideoThumbImage
);
