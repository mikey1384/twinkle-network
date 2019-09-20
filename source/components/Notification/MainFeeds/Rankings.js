import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import request from 'axios';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import RoundList from 'components/RoundList';
import MyRank from './MyRank';
import { connect } from 'react-redux';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { Color, borderRadius } from 'constants/css';
import { getRanks } from 'redux/actions/NotiActions';
import { useAppContext } from 'context';
import URL from 'constants/URL';

const API_URL = `${URL}/user`;

Rankings.propTypes = {
  all: PropTypes.array.isRequired,
  loaded: PropTypes.bool,
  getRanks: PropTypes.func.isRequired,
  rankModifier: PropTypes.number.isRequired,
  top30s: PropTypes.array.isRequired
};

function Rankings({ all, loaded, getRanks, rankModifier, top30s }) {
  const {
    user: {
      state: { rank, twinkleXP, userId }
    },
    requestHelpers: { auth }
  } = useAppContext();
  const [allSelected, setAllSelected] = useState(true);
  const userChangedTab = useRef(false);
  const mounted = useRef(true);
  const loading = useRef(null);
  const prevId = useRef(null);

  useEffect(() => {
    mounted.current = true;
    userChangedTab.current = false;
    if ((!loading.current && mounted.current) || (!prevId.current && userId)) {
      setAllSelected(true);
      loadRankings();
    }
    async function loadRankings() {
      loading.current = true;
      try {
        const {
          data: { all, rankModifier: modifier, top30s }
        } = await request.get(`${API_URL}/leaderBoard`, auth());
        if (mounted.current) {
          getRanks({ all, top30s, rankModifier: modifier });
        }
        loading.current = false;
        prevId.current = userId;
      } catch (error) {
        console.error(error.response || error);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [twinkleXP, userId]);

  useEffect(() => {
    setAllSelected(!!userId);
  }, [userId]);

  const users = allSelected ? all : top30s;
  const modifier = allSelected ? rankModifier : 0;

  return (
    <ErrorBoundary>
      {!!userId && (
        <FilterBar
          bordered
          style={{
            height: '4.5rem',
            fontSize: '1.6rem'
          }}
        >
          <nav
            className={allSelected ? 'active' : ''}
            onClick={() => {
              userChangedTab.current = true;
              setAllSelected(true);
            }}
          >
            My Ranking
          </nav>
          <nav
            className={allSelected ? '' : 'active'}
            onClick={() => {
              userChangedTab.current = true;
              setAllSelected(false);
            }}
          >
            Top 30
          </nav>
        </FilterBar>
      )}
      {!loaded && <Loading />}
      {loaded && allSelected && !!userId && (
        <MyRank myId={userId} rank={rank} twinkleXP={twinkleXP} />
      )}
      {loaded && allSelected && users.length === 0 && !!userId && (
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
      {loaded && users.length > 0 && (
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
                  background:
                    user.id === userId && rank > 3
                      ? Color.highlightGray()
                      : '#fff'
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
                        (rank <= 10 ? Color.logoBlue() : Color.darkGray())
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
                        (rank <= 10 ? Color.logoBlue() : Color.darkGray())
                      }
                      user={{ ...user, username: user.username }}
                      userId={userId}
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
      )}
    </ErrorBoundary>
  );
}

export default connect(
  state => ({
    all: state.NotiReducer.allRanks,
    rankModifier: state.NotiReducer.rankModifier,
    top30s: state.NotiReducer.top30s,
    loaded: state.NotiReducer.rankingsLoaded
  }),
  {
    getRanks
  }
)(Rankings);
