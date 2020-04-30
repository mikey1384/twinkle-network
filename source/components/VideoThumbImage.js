import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import request from 'axios';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { rewardValue } from 'constants/defaultValues';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import URL from 'constants/URL';

const API_URL = `${URL}/video`;
const xp = rewardValue.star;

VideoThumbImage.propTypes = {
  height: PropTypes.string,
  rewardLevel: PropTypes.number,
  onClick: PropTypes.func,
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
  videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default function VideoThumbImage({
  rewardLevel,
  height = '55%',
  onClick,
  src,
  style,
  videoId
}) {
  const {
    requestHelpers: { auth }
  } = useAppContext();
  const { userId } = useMyState();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, rewardLevel, userId]);

  const tagColor = useMemo(
    () =>
      rewardLevel === 5
        ? Color.gold()
        : rewardLevel === 4
        ? Color.brownOrange()
        : rewardLevel === 3
        ? Color.orange()
        : rewardLevel === 2
        ? Color.pink()
        : Color.logoBlue(),
    [rewardLevel]
  );

  return (
    <div
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        overFlow: 'hidden',
        paddingBottom: height,
        position: 'relative',
        cursor: onClick && 'pointer',
        ...style
      }}
      onClick={onClick}
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
      {!!rewardLevel && (
        <div
          style={{
            position: 'absolute',
            padding: '0.1rem 0.5rem',
            background: tagColor,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff'
          }}
        >
          {addCommasToNumber(rewardLevel * xp)} XP
        </div>
      )}
    </div>
  );
}
