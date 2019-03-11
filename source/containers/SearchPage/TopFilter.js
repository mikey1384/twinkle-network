import React from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';
import { connect } from 'react-redux';

TopFilter.propTypes = {
  applyFilter: PropTypes.func.isRequired,
  profileTheme: PropTypes.string,
  style: PropTypes.object,
  selectedFilter: PropTypes.string.isRequired
};

function TopFilter({ applyFilter, profileTheme, selectedFilter, style }) {
  const themeColor = profileTheme || 'logoBlue';
  return (
    <FilterBar color={themeColor} style={style} bordered>
      <nav
        className={selectedFilter === 'video' ? 'active' : ''}
        onClick={() => applyFilter('video')}
      >
        Videos
      </nav>
      <nav
        className={selectedFilter === 'url' ? 'active' : ''}
        onClick={() => applyFilter('url')}
      >
        Links
      </nav>
      <nav
        className={selectedFilter === 'subject' ? 'active' : ''}
        onClick={() => applyFilter('subject')}
      >
        Subjects
      </nav>
    </FilterBar>
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(TopFilter);
