import React from 'react'
import PropTypes from 'prop-types'
import FilterBar from 'components/FilterBar'

TopFilter.propTypes = {
  applyFilter: PropTypes.func.isRequired,
  style: PropTypes.object,
  selectedFilter: PropTypes.string.isRequired
}
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
        className={selectedFilter === 'user' ? 'active' : ''}
        onClick={() => applyFilter('user')}
      >
        Users
      </nav>
      <nav
        className={selectedFilter === 'url' ? 'active' : ''}
        onClick={() => applyFilter('url')}
      >
        Links
      </nav>
      <nav
        className={selectedFilter === 'post' ? 'active' : ''}
        onClick={() => applyFilter('post')}
      >
        Posts
      </nav>
      <nav
        className={selectedFilter === 'comment' ? 'active' : ''}
        onClick={() => applyFilter('comment')}
      >
        Comments
      </nav>
    </FilterBar>
  )
}
