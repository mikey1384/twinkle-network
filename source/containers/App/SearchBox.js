import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SearchInput from 'components/Texts/SearchInput'
import { changeSearch, initSearch } from 'redux/actions/SearchActions'

class SearchBox extends Component {
  static propTypes = {
    className: PropTypes.string,
    changeSearch: PropTypes.func.isRequired,
    initSearch: PropTypes.func.isRequired,
    innerRef: PropTypes.func,
    searchText: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  render() {
    const { className, initSearch, innerRef, searchText, style } = this.props
    return (
      <div className={className} style={style}>
        <SearchInput
          innerRef={innerRef ? ref => innerRef(ref) : () => {}}
          placeholder="Search Videos, Links, Users, and More"
          onChange={this.onContentSearch}
          value={searchText}
          onFocus={initSearch}
        />
      </div>
    )
  }

  onContentSearch = text => {
    const { changeSearch } = this.props
    changeSearch(text)
  }
}

export default connect(
  state => ({
    searchText: state.SearchReducer.searchText
  }),
  {
    changeSearch,
    initSearch
  }
)(withRouter(SearchBox))
