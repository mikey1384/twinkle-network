import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import request from 'axios';
import { auth } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { rewardValue } from 'constants/defaultValues';
import { css } from 'emotion';
import URL from 'constants/URL';

const API_URL = `${URL}/video`;
const xp = rewardValue.star;

VideoThumbImage.propTypes = {
  height: PropTypes.string,
  difficulty: PropTypes.number,
  playIcon: PropTypes.bool,
  src: PropTypes.string.isRequired,
  userId: PropTypes.number,
  videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

function VideoThumbImage({
  difficulty,
  height = '55%',
  playIcon,
  src,
  userId,
  videoId
}) {
  const [xpEarned, setXpEarned] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    checkXpStatus();
    async function checkXpStatus() {
      const authorization = auth();
      const authExists = !!authorization.headers.authorization;
      if (authExists) {
        try {
          const {
            data: { xpEarned }
          } = await request.get(
            `${API_URL}/xpEarned?videoId=${videoId}`,
            auth()
          );
          if (mounted.current) setXpEarned(xpEarned);
        } catch (error) {
          console.error(error.response || error);
        }
      } else {
        setXpEarned(false);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [videoId, difficulty, userId]);

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

export default connect(state => ({ userId: state.UserReducer.userId }))(
  VideoThumbImage
);
