import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import Loading from 'components/Loading'
import SearchInput from 'components/Texts/SearchInput'

export default class SectionPanel extends Component {
  static propTypes = {
    title: PropTypes.string,
    button: PropTypes.node,
    emptyMessage: PropTypes.string,
    isEmpty: PropTypes.bool,
    loaded: PropTypes.bool,
    loadMore: PropTypes.func,
    children: PropTypes.node,
    loadMoreButtonShown: PropTypes.bool,
    onSearch: PropTypes.func
  }

  state = {
    loading: false
  }

  render() {
    const {
      title,
      button,
      emptyMessage,
      isEmpty,
      loaded,
      children,
      loadMoreButtonShown,
      onSearch
    } = this.props
    const { loading } = this.state
    return (
      <div className="panel panel-primary">
        <div
          className="panel-heading"
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              width: '25%',
              fontSize: '2.5rem',
              alignItems: 'center',
              display: 'flex'
            }}
          >
            {title}
          </div>
          {onSearch && (
            <SearchInput
              style={{ width: '45%' }}
              onChange={this.onSearch}
              placeholder="test placeholder"
              value="tesitng"
            />
          )}
          <div
            style={{
              width: '30%',
              display: 'flex',
              flexDirection: 'row-reverse'
            }}
          >
            {button}
          </div>
        </div>
        <div className="panel-body">
          {loaded
            ? isEmpty && <div>{emptyMessage}</div>
            : isEmpty && <Loading />}
          {children}
          {loadMoreButtonShown && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                disabled={loading}
                className="btn btn-success"
                onClick={this.onLoadMore}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  onSearch = () => {
    const { onSearch } = this.props
    onSearch()
  }

  onLoadMore = () => {
    const { loadMore } = this.props
    const { loading } = this.state
    if (!loading) {
      this.setState({ loading: true })
      return loadMore().then(() => this.setState({ loading: false }))
    }
  }
}
