import React from 'react';
import MyRank from 'components/MyRank';
import RankingsListItem from 'components/RankingsListItem';
import { useNotiContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

export default function BottomMenu() {
  const {
    state: { allRanks }
  } = useNotiContext();
  const { rank, twinkleXP, userId } = useMyState();
  return (
    <div style={{ height: '50%', overflow: 'scroll' }}>
      <MyRank
        noBorderRadius
        myId={userId}
        rank={rank}
        twinkleXP={twinkleXP}
        style={{ marginTop: 0 }}
      />
      {allRanks.map(user => (
        <RankingsListItem
          key={user.id}
          small
          style={{
            padding: '1rem'
          }}
          myId={userId}
          user={user}
        />
      ))}
    </div>
  );
}
