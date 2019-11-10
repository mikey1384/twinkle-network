import React from 'react';
import SectionPanel from 'components/SectionPanel';

export default function Management() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <SectionPanel
        title="Moderators"
        emptyMessage="No Moderators"
        isEmpty={true}
        loaded={true}
        loadMore={() => console.log('loading more')}
      ></SectionPanel>
    </div>
  );
}
