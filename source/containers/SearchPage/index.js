import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { searchPage } from './Styles'
import FilterBar from 'components/FilterBar'

export default class SearchPage extends Component {
  static propTypes = {
    searchText: PropTypes.string.isRequired
  }

  state = {
    selectedFilter: 'all'
  }

  render() {
    const { searchText } = this.props
    const { selectedFilter } = this.state
    return (
      <div className={searchPage}>
        <div
          style={{
            width: '80%'
          }}
        >
          <FilterBar bordered>
            <nav
              className={selectedFilter === 'all' ? 'active' : ''}
              onClick={() => this.applyFilter('all')}
            >
              All
            </nav>
            <nav
              className={selectedFilter === 'video' ? 'active' : ''}
              onClick={() => this.applyFilter('video')}
            >
              Videos
            </nav>
            <nav
              className={selectedFilter === 'url' ? 'active' : ''}
              onClick={() => this.applyFilter('url')}
            >
              Links
            </nav>
            <nav
              className={selectedFilter === 'post' ? 'active' : ''}
              onClick={() => this.applyFilter('post')}
            >
              Posts
            </nav>
            <nav
              className={selectedFilter === 'comment' ? 'active' : ''}
              onClick={() => this.applyFilter('comment')}
            >
              Comments
            </nav>
          </FilterBar>
          You are searching {searchText}
        </div>
      </div>
    )
  }

  applyFilter = filter => {
    this.setState({ selectedFilter: filter })
  }
}
