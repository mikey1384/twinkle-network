import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import Loading from 'components/Loading'
import SearchInput from 'components/Texts/SearchInput'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'

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
      isSearching,
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
      <div
        className={css`
          border: 1px solid ${Color.borderGray()};
          width: 100%;
          background: #fff;
          border-radius: ${borderRadius};
          margin-bottom: 1rem;
          > header {
            display: grid;
            width: 100%;
            grid-template-areas: 'title search buttons';
            grid-template-columns: auto ${onSearch ? '40%' : 'auto'} auto;
            background: ${Color.logoBlue()};
            color: #fff;
            border-top-left-radius: ${borderRadius};
            border-top-right-radius: ${borderRadius};
            padding: 1rem;
            font-size: 2.5rem;
            align-items: center;
            margin-bottom: 1rem;
          }
          > main {
            position: relative;
            padding: 1rem;
            width: 100%;
            min-height: 15rem;
          }
          @media (max-width: ${mobileMaxWidth}) {
            border-radius: 0;
            border: 0;
            > header {
              border-radius: 0;
            }
          }
        `}
        style={style}
      >
        <header>
          <div style={{ gridArea: 'title', marginRight: '1rem' }}>{title}</div>
          {onSearch && (
            <SearchInput
              style={{
                color: Color.black(),
                gridArea: 'search',
                width: '100%',
                justifySelf: 'center',
                zIndex: 0
              }}
              onChange={this.onSearch}
              placeholder={searchPlaceholder}
              value={searchQuery}
            />
          )}
          <div style={{ gridArea: 'buttons', justifySelf: 'end' }}>
            {button}
          </div>
        </header>
        <main>
          {this.renderEmptyMessage()}
          {searchQuery && isSearching ? (
            <div className={this.statusMsg}>Searching...</div>
          ) : (
            children
          )}
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
        </main>
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
          <div className={this.statusMsg}>
            {searchQuery
              ? isSearching ? 'Searching...' : 'No Results'
              : emptyMessage}
          </div>
        )
      }
      return <Loading absolute />
    }
    return null
  }

  statusMsg = css`
    font-size: 3rem;
    font-weight: bold;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  `
}
