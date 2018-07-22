import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SearchInput from 'components/Texts/SearchInput'
import { onChangeInput } from 'redux/actions/SearchActions'

class SearchBox extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChangeInput: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  render() {
    const { className, searchText, style } = this.props
    return (
      <div className={className} style={style}>
        <SearchInput
          placeholder="Search for Videos and Links"
          onChange={this.onContentSearch}
          value={searchText}
        />
      </div>
    )
  }

  onContentSearch = text => {
    const { onChangeInput } = this.props
    onChangeInput(text)
  }
}

export default connect(
  state => ({
    searchText: state.SearchReducer.searchText
  }),
  {
    onChangeInput
  }
)(withRouter(SearchBox))
