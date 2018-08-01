import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import Result from './Result'
import { setResults } from 'redux/actions/SearchActions'
import { stringIsEmpty } from 'helpers/stringHelpers'
import { searchContent } from 'helpers/requestHelpers'
import { connect } from 'react-redux'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'
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

  componentDidUpdate(prevProps) {
    const { filter, searchText, setResults } = this.props
    if (prevProps.searchText !== searchText || prevProps.filter !== filter) {
      clearTimeout(this.timer)
      if (stringIsEmpty(searchText) || searchText.length < 2) {
        setResults([])
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
    const { searching } = this.state
    const { closeSearch, filter, results } = this.props
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
              <div style={{ textTransform: 'capitalize' }}>
                {`No ${filter === 'url' ? 'link' : filter}s Found`}
              </div>
              <CloseText style={{ marginTop: '1rem', marginBottom: '1rem' }} />
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
    const data = await searchContent({ filter, searchText, dispatch })
    if (data) setResults(data)
    return this.setState({ searching: false })
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
