import React from 'react';
import PropTypes from 'prop-types';
import MyRank from 'components/MyRank';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import RankingsListItem from 'components/RankingsListItem';

VocabInfo.propTypes = {
  rankings: PropTypes.array
};

export default function VocabInfo({ rankings }) {
  const { rank, twinkleXP, userId } = useMyState();
  return (
    <div style={{ height: '100%' }}>
      <div
        style={{
          height: '50%',
          borderBottom: `1px solid ${Color.borderGray()}`
        }}
      ></div>
      <div style={{ height: '50%', overflow: 'scroll' }}>
        <MyRank
          myId={userId}
          rank={rank}
          twinkleXP={twinkleXP}
          style={{ marginTop: 0, borderRadius: 0 }}
        />
        {rankings.map(user => (
          <RankingsListItem key={user.id} myId={userId} user={user} />
        ))}
      </div>
    </div>
  );
}
