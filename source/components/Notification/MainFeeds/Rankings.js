import React, { useEffect, useMemo, useRef, useState } from 'react';
import Loading from 'components/Loading';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import RoundList from 'components/RoundList';
import MyRank from './MyRank';
import { Color, borderRadius } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { useNotiContext } from 'contexts';

export default function Rankings() {
  const { rank, twinkleXP, userId } = useMyState();
  const {
    state: { allRanks, top30s, rankingsLoaded }
  } = useNotiContext();
  const [allSelected, setAllSelected] = useState(true);
  const userChangedTab = useRef(false);
  const mounted = useRef(true);
  const prevId = useRef(userId);

  useEffect(() => {
    mounted.current = true;
    userChangedTab.current = false;
    if (!rankingsLoaded && mounted.current) {
      setAllSelected(!!userId);
    }
    prevId.current = userId;
  }, [userId, rankingsLoaded]);

  useEffect(() => {
    setAllSelected(!!userId);
  }, [userId]);

  const users = useMemo(() => (allSelected ? allRanks : top30s), [
    allRanks,
    allSelected,
    top30s
  ]);

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
      {rankingsLoaded === false && <Loading />}
      {!!rankingsLoaded && allSelected && !!userId && (
        <MyRank myId={userId} rank={rank} twinkleXP={twinkleXP} />
      )}
      {rankingsLoaded && allSelected && users.length === 0 && !!userId && (
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
      {rankingsLoaded && users.length > 0 && (
        <RoundList style={{ marginTop: 0 }}>
          {users.map(user => {
            const rankColor =
              user.rank === 1
                ? Color.gold()
                : user.rank === 2
                ? Color.lighterGray()
                : user.rank === 3
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
                    user.id === userId && user.rank > 3
                      ? Color.highlightGray()
                      : '#fff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: user.rank < 100 ? '2rem' : '1.5rem',
                      width: '3rem',
                      marginRight: '1rem',
                      textAlign: 'center',
                      color:
                        rankColor ||
                        (user.rank <= 10 ? Color.logoBlue() : Color.darkGray())
                    }}
                  >
                    {user.rank ? `#${user.rank}` : '--'}
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
                        (user.rank <= 10 ? Color.logoBlue() : Color.darkGray())
                      }
                      user={{ ...user, username: user.username }}
                      userId={userId}
                      style={{ marginTop: '0.5rem' }}
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
