import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import request from 'axios';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import { connect } from 'react-redux';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { auth } from 'helpers/requestHelpers';
import { Color, borderRadius } from 'constants/css';
import URL from 'constants/URL';

const API_URL = `${URL}/user`;

Rankings.propTypes = {
  myId: PropTypes.number,
  twinkleXP: PropTypes.number
};

function Rankings({ myId, twinkleXP }) {
  const [all, setAll] = useState([]);
  const [top30s, setTop30s] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [rankModifier, setRankModifier] = useState(0);
  const [prevId, setPrevId] = useState(twinkleXP);
  const mounted = useRef(true);

  useEffect(() => {
    loadRankings();
    async function loadRankings() {
      try {
        const {
          data: { all, rankModifier, top30s }
        } = await request.get(`${API_URL}/leaderBoard`, auth());
        if (mounted.current) {
          if (myId !== prevId) {
            setAllSelected(!!myId && all.length > 0);
          }
          setAll(all);
          setTop30s(top30s);
          setLoaded(true);
          setRankModifier(rankModifier);
          setPrevId(myId);
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [myId, twinkleXP]);

  const users = allSelected ? all : top30s;
  const modifier = allSelected ? rankModifier : 0;
  return (
    <ErrorBoundary>
      {!!myId && (
        <FilterBar
          bordered
          style={{
            marginTop: '1rem',
            height: '4.5rem',
            fontSize: '1.6rem'
          }}
        >
          <nav
            className={allSelected ? 'active' : ''}
            onClick={() => setAllSelected(true)}
          >
            My Ranking
          </nav>
          <nav
            className={allSelected ? '' : 'active'}
            onClick={() => setAllSelected(false)}
          >
            Top 30
          </nav>
        </FilterBar>
      )}
      {loaded === false && <Loading />}
      {loaded && allSelected && users.length === 0 && (
        <div
          style={{
            background: '#fff',
            borderRadius,
            padding: '1rem',
            border: `1px solid ${Color.borderGray()}`
          }}
        >
          You are not ranked. To get ranked, earn XP by watching a starred video
          or leaving comments
        </div>
      )}
      {users.map(user => {
        const rank = !user.twinkleXP
          ? undefined
          : users.filter(otherUser => otherUser.twinkleXP > user.twinkleXP)
              .length +
            1 +
            modifier;
        const rankColor =
          rank === 1
            ? Color.gold()
            : rank === 2
            ? Color.lightGray()
            : rank === 3
            ? Color.orange()
            : undefined;
        return (
          <li
            key={user.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: user.id === myId ? Color.channelGray() : undefined
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: rank < 100 ? '2rem' : '1.5rem',
                  width: '3rem',
                  marginRight: '1rem',
                  textAlign: 'center',
                  color:
                    rankColor ||
                    (rank <= 10 ? Color.logoBlue() : Color.buttonGray())
                }}
              >
                {rank ? `#${rank}` : '--'}
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <ProfilePic
                  style={{ width: '6rem', height: '6rem' }}
                  profilePicId={user.profilePicId}
                  userId={user.id}
                />
                <UsernameText
                  color={
                    rankColor ||
                    (rank <= 10 ? Color.logoBlue() : Color.buttonGray())
                  }
                  user={{ ...user, username: user.username }}
                  userId={myId}
                  style={{ display: 'block', marginTop: '0.5rem' }}
                />
              </div>
            </div>
            <div style={{ fontWeight: 'bold' }}>
              <span style={{ color: Color.logoGreen() }}>
                {addCommasToNumber(user.twinkleXP || 0)}
              </span>{' '}
              <span style={{ color: Color.gold() }}>XP</span>
            </div>
          </li>
        );
      })}
    </ErrorBoundary>
  );
}

export default connect(state => ({
  myId: state.UserReducer.userId,
  twinkleXP: state.UserReducer.twinkleXP
}))(Rankings);
