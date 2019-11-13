import React from 'react';
import SectionPanel from 'components/SectionPanel';
import SideMenu from 'components/SideMenu';
import Icon from 'components/Icon';
import { NavLink } from 'react-router-dom';

export default function Main() {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <SideMenu>
        <NavLink to="/subjects" activeClassName="active">
          <Icon icon="bolt" />
          <span style={{ marginLeft: '1.1rem' }}>Subjects</span>
        </NavLink>
        <NavLink to="/videos" activeClassName="active">
          <Icon icon="film" />
          <span style={{ marginLeft: '1.1rem' }}>Videos</span>
        </NavLink>
        <NavLink to="/links" activeClassName="active">
          <Icon icon="book" />
          <span style={{ marginLeft: '1.1rem' }}>Links</span>
        </NavLink>
      </SideMenu>
      <div
        style={{
          marginTop: '1rem',
          width: 'CALC(100vw - 21rem)',
          marginLeft: '20rem'
        }}
      >
        <SectionPanel
          title="Moderators"
          emptyMessage="No Moderators"
          isEmpty
          loaded
          loadMore={() => console.log('loading more')}
        />
      </div>
    </div>
  );
}
