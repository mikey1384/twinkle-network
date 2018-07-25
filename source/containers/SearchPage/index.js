import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { searchPage } from './Styles'
import TopFilter from './TopFilter'
import Instructions from './Instructions'
import Checkbox from 'components/Checkbox'
import { stringIsEmpty } from 'helpers/stringHelpers'
import { setDefaultSearchFilter } from 'helpers/requestHelpers'
import { Color } from 'constants/css'
import { closeSearch } from 'redux/actions/SearchActions'
import { updateDefaultSearchFilter } from 'redux/actions/UserActions'
import { connect } from 'react-redux'

class SearchPage extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    closeSearch: PropTypes.func.isRequired,
    focusSearchBox: PropTypes.func.isRequired,
    searchFilter: PropTypes.string,
    searchText: PropTypes.string.isRequired,
    userId: PropTypes.number
  }

  constructor({ searchFilter = 'video' }) {
    super()
    this.state = {
      selectedFilter: searchFilter
    }
  }

  render() {
    const {
      className,
      closeSearch,
      searchFilter,
      searchText,
      userId
    } = this.props
    const { selectedFilter } = this.state
    return (
      <div className={`${searchPage} ${className}`}>
        <div
          style={{
            width: '80%'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                cursor: 'pointer',
                color: Color.darkGray(),
                fontSize: '1.7rem',
                lineHeight: 1,
                textDecoration: 'underline',
                fontWeight: 'bold'
              }}
              onClick={closeSearch}
            >
              Tap Here to Go Back
            </p>
          </div>
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              padding: '1rem',
              color: Color.darkGray()
            }}
          >
            {stringIsEmpty(searchText) ? (
              <div style={{ textTransform: 'capitalize' }}>
                {this.renderHelperText()}
                {userId && (
                  <Checkbox
                    label="Default:"
                    checked={selectedFilter === searchFilter}
                    onClick={this.setDefaultSearchFilter}
                  />
                )}
              </div>
            ) : (
              `Searching: ${searchText}`
            )}
          </div>
          <TopFilter
            applyFilter={this.applyFilter}
            selectedFilter={selectedFilter}
          />
          {stringIsEmpty(searchText) ? <Instructions /> : <div />}
        </div>
      </div>
    )
  }

  applyFilter = filter => {
    const { focusSearchBox } = this.props
    this.setState({ selectedFilter: filter })
    focusSearchBox()
  }

  renderHelperText = () => {
    const { selectedFilter } = this.state
    if (selectedFilter === 'all') return 'Search all content type...'
    if (selectedFilter === 'url') return 'Search links...'
    return `Search ${selectedFilter}s...`
  }

  setDefaultSearchFilter = async() => {
    const { selectedFilter } = this.state
    const {
      dispatch,
      focusSearchBox,
      searchFilter,
      updateDefaultSearchFilter
    } = this.props
    if (selectedFilter === searchFilter) return focusSearchBox()
    await setDefaultSearchFilter({
      filter: selectedFilter,
      dispatch
    })
    updateDefaultSearchFilter(selectedFilter)
    focusSearchBox()
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    searchFilter: state.UserReducer.searchFilter
  }),
  dispatch => ({
    dispatch,
    closeSearch: () => dispatch(closeSearch()),
    updateDefaultSearchFilter: filter =>
      dispatch(updateDefaultSearchFilter(filter))
  })
)(SearchPage)
