import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import Result from './Result'
import { setResults } from 'redux/actions/SearchActions'
import { stringIsEmpty } from 'helpers/stringHelpers'
import { searchContent } from 'helpers/requestHelpers'
import { connect } from 'react-redux'
import { Color } from 'constants/css'
import CloseText from './CloseText'

class Results extends Component {
  static propTypes = {
    closeSearch: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired,
    searchText: PropTypes.string.isRequired,
    setResults: PropTypes.func.isRequired
  }

  state = {
    searching: false
  }

  timer = null

  componentDidMount() {
    const { filter, results, searchText } = this.props
    if (
      !stringIsEmpty(searchText) &&
      searchText.length > 1 &&
      results.length === 0
    ) {
      this.setState({ searching: true })
      this.timer = setTimeout(
        () => this.searchContent({ filter, searchText }),
        300
      )
    }
  }

  componentDidUpdate(prevProps) {
    const { filter, searchText, setResults } = this.props
    if (prevProps.searchText !== searchText || prevProps.filter !== filter) {
      setResults([])
      clearTimeout(this.timer)
      if (stringIsEmpty(searchText) || searchText.length < 2) {
        return this.setState({ searching: false })
      }
      this.setState({ searching: true })
      this.timer = setTimeout(
        () => this.searchContent({ filter, searchText }),
        300
      )
    }
  }

  render() {
    const { searching } = this.state
    const { closeSearch, filter, results } = this.props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          justifyContent: 'center'
        }}
      >
        {searching && <Loading />}
        {results.map(result => (
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
                alignItems: 'center'
              }}
            >
              <span style={{ textTransform: 'capitalize' }}>
                {`No ${filter === 'url' ? 'link' : filter}s Found`}
              </span>
            </div>
          )}
        {!searching && (
          <CloseText style={{ marginTop: '1rem', marginBottom: '2rem' }} />
        )}
      </div>
    )
  }

  searchContent = async({ filter, searchText }) => {
    const { dispatch, setResults } = this.props
    const data = await searchContent({ filter, searchText, dispatch })
    setResults(data)
    this.setState({ searching: false })
  }
}

export default connect(
  state => ({
    results: state.SearchReducer.results
  }),
  dispatch => ({
    setResults: results => dispatch(setResults(results)),
    dispatch
  })
)(Results)
