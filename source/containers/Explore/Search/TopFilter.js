import React from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';

TopFilter.propTypes = {
  className: PropTypes.string,
  selectedFilter: PropTypes.string.isRequired
};

export default function TopFilter({ selectedFilter, className }) {
  return (
    <FilterBar className={className} bordered>
      <nav className={selectedFilter === 'video' ? 'active' : ''}>Videos</nav>
      <nav className={selectedFilter === 'url' ? 'active' : ''}>Links</nav>
      <nav className={selectedFilter === 'subject' ? 'active' : ''}>
        Subjects
      </nav>
    </FilterBar>
  );
}
