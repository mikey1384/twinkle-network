import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import request from 'axios';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import RoundList from 'components/RoundList';
import { connect } from 'react-redux';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { auth } from 'helpers/requestHelpers';
import { Color, borderRadius } from 'constants/css';
import { css } from 'emotion';
import { getRanks } from 'redux/actions/NotiActions';
import URL from 'constants/URL';

const API_URL = `${URL}/user`;

Rankings.propTypes = {
  all: PropTypes.array.isRequired,
  loaded: PropTypes.bool,
  myId: PropTypes.number,
  rank: PropTypes.number,
  getRanks: PropTypes.func.isRequired,
  rankModifier: PropTypes.number.isRequired,
  top30s: PropTypes.array.isRequired,
  twinkleXP: PropTypes.number
};

function Rankings({
  all,
  loaded,
  getRanks,
  myId,
  rank,
  rankModifier,
  top30s,
  twinkleXP
}) {
  const [allSelected, setAllSelected] = useState(true);
  const mounted = useRef(true);
  const rankedColor =
    rank === 1 ? Color.gold() : rank !== 0 && rank <= 3 ? '#fff' : undefined;

  useEffect(() => {
    mounted.current = true;
    setAllSelected(loaded && !!myId);
    loadRankings();
    async function loadRankings() {
      try {
        const {
          data: { all, rankModifier: modifier, top30s }
        } = await request.get(`${API_URL}/leaderBoard`, auth());
        if (mounted.current) {
          getRanks({ all, top30s, rankModifier: modifier });
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
      {!loaded && <Loading />}
      {loaded && allSelected && (
        <div
          style={{
            marginTop: '1rem',
            marginBottom: myId ? '1rem' : 0,
            background: myId
              ? rank > 0
                ? rank < 3
                  ? Color.black()
                  : rank === 3
                  ? Color.orange()
                  : '#fff'
                : '#fff'
              : null
          }}
          className={css`
            width: 100%;
            margin-bottom: 0px;
            text-align: center;
            padding: 1rem;
            border: 1px solid #eeeeee;
            border-radius: ${borderRadius};
            p {
              font-weight: bold;
            }
            a {
              font-size: 1.5rem;
              font-weight: bold;
            }
          `}
        >
          {
            <p>
              <span
                style={{
                  color: rankedColor || Color.logoGreen(),
                  fontSize: '3rem'
                }}
              >
                {twinkleXP ? addCommasToNumber(twinkleXP) : 0}
              </span>{' '}
              <span
                style={{
                  color: rankedColor || Color.gold(),
                  fontSize: '3rem'
                }}
              >
                XP
              </span>
              &nbsp;&nbsp;
              <span
                style={{
                  color:
                    rankedColor ||
                    (rank > 0 && rank <= 10
                      ? Color.pink()
                      : Color.buttonGray()),
                  fontSize: '2rem'
                }}
              >
                {rank ? `Rank #${rank}` : 'Unranked'}
              </span>
            </p>
          }
        </div>
      )}
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
      <RoundList style={{ marginTop: 0 }}>
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
                background: user.id === myId ? Color.channelGray() : '#fff'
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
      </RoundList>
    </ErrorBoundary>
  );
}

export default connect(
  state => ({
    all: state.NotiReducer.allRanks,
    myId: state.UserReducer.userId,
    rank: state.UserReducer.rank,
    rankModifier: state.NotiReducer.rankModifier,
    top30s: state.NotiReducer.top30s,
    twinkleXP: state.UserReducer.twinkleXP,
    loaded: state.NotiReducer.rankingsLoaded
  }),
  {
    getRanks
  }
)(Rankings);
