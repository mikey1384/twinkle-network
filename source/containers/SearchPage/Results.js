import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import Result from './Result'
import { setResults, showMoreResults } from 'redux/actions/SearchActions'
import { queryStringForArray, stringIsEmpty } from 'helpers/stringHelpers'
import { searchContent } from 'helpers/requestHelpers'
import { connect } from 'react-redux'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'
import CloseText from './CloseText'
import LoadMoreButton from 'components/Buttons/LoadMoreButton'

class Results extends Component {
  static propTypes = {
    changeFilter: PropTypes.func.isRequired,
    closeSearch: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    results: PropTypes.array.isRequired,
    searchText: PropTypes.string.isRequired,
    setResults: PropTypes.func.isRequired
  }

  state = {
    searching: false,
    loadingMore: false
  }

  timer = null

  componentDidMount() {
    const { filter, searchText } = this.props
    if (!stringIsEmpty(searchText) && searchText.length > 1) {
      this.setState({ searching: true })
      this.timer = setTimeout(
        () => this.searchContent({ filter, searchText }),
        500
      )
    }
  }

  componentDidUpdate(prevProps) {
    const { filter, searchText, setResults } = this.props
    if (prevProps.searchText !== searchText || prevProps.filter !== filter) {
      clearTimeout(this.timer)
      if (stringIsEmpty(searchText) || searchText.length < 2) {
        setResults({ results: [], loadMoreButton: false })
        return this.setState({ searching: false })
      }
      this.setState({ searching: true })
      this.timer = setTimeout(
        () => this.searchContent({ filter, searchText }),
        500
      )
    }
  }

  render() {
    const { loadingMore, searching } = this.state
    const {
      changeFilter,
      closeSearch,
      filter,
      loadMoreButton,
      results
    } = this.props
    const availableFilters = ['video', 'url', 'question', 'discussion'].filter(
      availableFilter => availableFilter !== filter
    )
    return (
      <div
        className={css`
          @media (max-width: ${mobileMaxWidth}) {
            padding-bottom: 30rem;
          }
        `}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          justifyContent: 'center'
        }}
      >
        {searching && <Loading />}
        {!searching &&
          results.map(result => (
            <Result
              key={result.id}
              closeSearch={closeSearch}
              type={filter}
              result={result}
            />
          ))}
        {!searching &&
          results.length === 0 && (
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: Color.darkGray(),
                justifyContent: 'center',
                height: '40vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ textTransform: 'capitalize' }}>{`No ${
                  filter === 'url' ? 'link' : filter
                }s Found`}</p>
                <div style={{ marginTop: '1rem', fontSize: '2rem' }}>
                  Search with the same keyword(s) for:
                  {availableFilters.map((availableFilter, index) => (
                    <p style={{ textTransform: 'capitalize' }} key={index}>
                      <a
                        style={{ cursor: 'pointer' }}
                        onClick={() => changeFilter(availableFilter)}
                      >{`${
                        availableFilter === 'url' ? 'link' : availableFilter
                      }s`}</a>
                    </p>
                  ))}
                </div>
              </div>
              <CloseText
                text="Or tap to close"
                style={{ marginTop: '3rem', marginBottom: '1rem' }}
              />
            </div>
          )}
        {!searching &&
          loadMoreButton && (
            <div style={{ paddingBottom: '8rem' }}>
              <LoadMoreButton
                filled
                info
                loading={loadingMore}
                onClick={this.loadMoreSearchResults}
              />
            </div>
          )}
        {!searching &&
          results.length > 0 && (
            <CloseText
              className="desktop"
              style={{
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '1rem',
                padding: '1.5rem',
                borderRadius: borderRadius,
                background: Color.lightGray(0.8)
              }}
            />
          )}
      </div>
    )
  }

  searchContent = async({ filter, searchText }) => {
    const { dispatch, setResults } = this.props
    const data = await searchContent({
      filter,
      searchText,
      dispatch
    })
    if (data) setResults(data)
    return this.setState({ searching: false })
  }

  loadMoreSearchResults = async() => {
    const {
      dispatch,
      filter,
      results,
      searchText,
      showMoreResults
    } = this.props
    this.setState({ loadingMore: true })
    const data = await searchContent({
      filter,
      searchText,
      shownResults: queryStringForArray(results, 'id', 'shownResults'),
      dispatch
    })
    if (data) showMoreResults(data)
    this.setState({ loadingMore: false })
  }
}

export default connect(
  state => ({
    loadMoreButton: state.SearchReducer.loadMoreButton,
    results: state.SearchReducer.results
  }),
  dispatch => ({
    setResults: data => dispatch(setResults(data)),
    showMoreResults: data => dispatch(showMoreResults(data)),
    dispatch
  })
)(Results)
