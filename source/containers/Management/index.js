import React from 'react';
import SectionPanel from 'components/SectionPanel';
import { useContentState, useMyState } from 'helpers/hooks';

export default function Management() {
  const { userId } = useMyState();
  const profile = useContentState({
    contentType: 'user',
    contentId: userId
  });
  const { userType } = profile;
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
        isEmpty={!userType}
        loaded={true}
        loadMore={() => console.log('loading more')}
      ></SectionPanel>
    </div>
  );
}
