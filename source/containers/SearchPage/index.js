import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { searchPage } from './Styles'
import TopFilter from './TopFilter'
import Instructions from './Instructions'
import Checkbox from 'components/Checkbox'
import Results from './Results'
import { stringIsEmpty } from 'helpers/stringHelpers'
import { setDefaultSearchFilter } from 'helpers/requestHelpers'
import { Color } from 'constants/css'
import { changeFilter, closeSearch } from 'redux/actions/SearchActions'
import { updateDefaultSearchFilter } from 'redux/actions/UserActions'
import { connect } from 'react-redux'
import CloseText from './CloseText'

class SearchPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    changeFilter: PropTypes.func.isRequired,
    closeSearch: PropTypes.func.isRequired,
    focusSearchBox: PropTypes.func.isRequired,
    searchFilter: PropTypes.string,
    searchText: PropTypes.string.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    userId: PropTypes.number
  }

  componentDidMount() {
    const { selectedFilter, searchFilter = 'video', changeFilter } = this.props
    if (!selectedFilter) changeFilter(searchFilter)
  }

  render() {
    const {
      closeSearch,
      selectedFilter,
      searchFilter,
      searchText,
      userId
    } = this.props
    return (
      <div className={searchPage}>
        <div
          style={{
            width: '80%'
          }}
        >
          <CloseText />
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
              </div>
            ) : (
              <span>
                <span style={{ textTransform: 'capitalize' }}>
                  {selectedFilter === 'url' ? 'link' : selectedFilter}
                </span>: {`"${searchText}"`}
              </span>
            )}
            {userId && (
              <Checkbox
                label="Default:"
                checked={selectedFilter === searchFilter}
                onClick={this.setDefaultSearchFilter}
              />
            )}
          </div>
          <TopFilter
            applyFilter={this.applyFilter}
            selectedFilter={selectedFilter}
          />
          {stringIsEmpty(searchText) ? (
            <Instructions />
          ) : (
            <Results
              closeSearch={closeSearch}
              searchText={searchText}
              filter={selectedFilter}
            />
          )}
        </div>
      </div>
    )
  }

  applyFilter = filter => {
    const { changeFilter, focusSearchBox } = this.props
    changeFilter(filter)
    focusSearchBox()
  }

  renderHelperText = () => {
    const { selectedFilter } = this.props
    if (selectedFilter === 'all') return 'Search all content type...'
    if (selectedFilter === 'url') return 'Search links...'
    return `Search ${selectedFilter}s...`
  }

  setDefaultSearchFilter = async() => {
    const {
      dispatch,
      focusSearchBox,
      searchFilter,
      selectedFilter,
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
    searchFilter: state.UserReducer.searchFilter,
    selectedFilter: state.SearchReducer.selectedFilter
  }),
  dispatch => ({
    dispatch,
    changeFilter: filter => dispatch(changeFilter(filter)),
    closeSearch: () => dispatch(closeSearch()),
    updateDefaultSearchFilter: filter =>
      dispatch(updateDefaultSearchFilter(filter))
  })
)(SearchPage)
