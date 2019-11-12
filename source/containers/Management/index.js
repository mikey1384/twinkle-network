import React, { useMemo } from 'react';
import SectionPanel from 'components/SectionPanel';
import NotFound from 'components/NotFound';
import { useMyState } from 'helpers/hooks';

export default function Management() {
  const { userType } = useMyState();
  return useMemo(
    () => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {userType ? (
          <SectionPanel
            title="Moderators"
            emptyMessage="No Moderators"
            isEmpty
            loaded
            loadMore={() => console.log('loading more')}
          ></SectionPanel>
        ) : (
          <NotFound
            title="For moderators only"
            text="You are not authorized to view this page"
          />
        )}
      </div>
    ),
    [userType]
  );
}
