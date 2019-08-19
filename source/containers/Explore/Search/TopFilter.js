import React from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';

TopFilter.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object,
  selectedFilter: PropTypes.string.isRequired
};

export default function TopFilter({ history, selectedFilter, className }) {
  return (
    <FilterBar className={className} bordered>
      <nav
        onClick={() => history.push('/videos')}
        className={selectedFilter === 'videos' ? 'active' : ''}
      >
        Videos
      </nav>
      <nav
        onClick={() => history.push('/links')}
        className={selectedFilter === 'links' ? 'active' : ''}
      >
        Links
      </nav>
      <nav
        onClick={() => history.push('/subjects')}
        className={selectedFilter === 'subjects' ? 'active' : ''}
      >
        Subjects
      </nav>
    </FilterBar>
  );
}
