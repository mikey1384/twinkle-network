import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import Loading from 'components/Loading'
import SearchInput from 'components/Texts/SearchInput'
import { sectionPanel } from './Styles'
import { Color } from 'constants/css'

export default class SectionPanel extends Component {
  static propTypes = {
    title: PropTypes.string,
    button: PropTypes.node,
    emptyMessage: PropTypes.string,
    isEmpty: PropTypes.bool,
    isSearching: PropTypes.bool,
    loaded: PropTypes.bool,
    loadMore: PropTypes.func,
    children: PropTypes.node,
    loadMoreButtonShown: PropTypes.bool,
    onSearch: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    searchQuery: PropTypes.string,
    style: PropTypes.object
  }

  state = {
    loading: false
  }

  render() {
    const {
      title,
      button,
      children,
      loadMoreButtonShown,
      onSearch,
      searchPlaceholder,
      searchQuery = '',
      style = {}
    } = this.props
    const { loading } = this.state
    return (
      <div className={sectionPanel} style={style}>
        <div className="header">
          <div style={{ gridArea: 'title' }}>{title}</div>
          {onSearch && (
            <SearchInput
              style={{
                color: Color.black(),
                gridArea: 'search',
                width: '100%',
                justifySelf: 'center'
              }}
              onChange={this.onSearch}
              placeholder={searchPlaceholder}
              value={searchQuery}
            />
          )}
          <div style={{ gridArea: 'buttons', justifySelf: 'end' }}>
            {button}
          </div>
        </div>
        <div className="body">
          {this.renderEmptyMessage()}
          {children}
          {loadMoreButtonShown &&
            !searchQuery && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  transparent
                  disabled={loading}
                  onClick={this.onLoadMore}
                  style={{ fontSize: '2rem' }}
                >
                  Load More
                </Button>
              </div>
            )}
        </div>
      </div>
    )
  }

  onSearch = text => {
    const { onSearch } = this.props
    onSearch(text)
  }

  onLoadMore = () => {
    const { loadMore } = this.props
    const { loading } = this.state
    if (!loading) {
      this.setState({ loading: true })
      return loadMore().then(() => this.setState({ loading: false }))
    }
  }

  renderEmptyMessage = () => {
    const {
      emptyMessage,
      isEmpty,
      isSearching,
      loaded,
      searchQuery
    } = this.props
    if (isEmpty) {
      if (loaded) {
        return (
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              padding: '2rem 0',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {searchQuery
              ? isSearching ? 'Searching...' : 'No Results'
              : emptyMessage}
          </div>
        )
      }
      return <Loading />
    }
    return null
  }
}
