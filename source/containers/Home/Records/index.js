import React from 'react';
import SectionPanel from 'components/SectionPanel';
import ContentPanel from 'components/ContentPanel';
import ProfilePanel from 'components/ProfilePanel';

export default function Records() {
  return (
    <div>
      <SectionPanel title={`Most Viewed Video`} loaded>
        <ContentPanel
          key={'video' + 9854}
          style={{ marginBottom: '1rem', zIndex: 999 }}
          contentId={9854}
          contentType={'video'}
          commentsLoadLimit={5}
          numPreviewComments={1}
        />
      </SectionPanel>
      <SectionPanel title="3 Million XP Milestone User" loaded>
        <ProfilePanel expandable profileId={361} />
      </SectionPanel>
    </div>
  );
}
