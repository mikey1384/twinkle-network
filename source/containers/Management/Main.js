import React from 'react';
import SectionPanel from 'components/SectionPanel';

export default function Main() {
  return (
    <SectionPanel title="Moderators" emptyMessage="No Moderators" loaded>
      <div
        style={{
          width: '100%',
          height: '20rem',
          border: '1px solid red'
        }}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </SectionPanel>
  );
}
