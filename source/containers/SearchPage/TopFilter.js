import React from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';

TopFilter.propTypes = {
  applyFilter: PropTypes.func.isRequired,
  style: PropTypes.object,
  selectedFilter: PropTypes.string.isRequired
};
export default function TopFilter({ applyFilter, selectedFilter, style }) {
  return (
    <FilterBar style={style} bordered>
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
        className={selectedFilter === 'question' ? 'active' : ''}
        onClick={() => applyFilter('question')}
      >
        Subjects
      </nav>
      <nav
        className={selectedFilter === 'discussion' ? 'active' : ''}
        onClick={() => applyFilter('discussion')}
      >
        Discussions
      </nav>
    </FilterBar>
  );
}
