import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { searchPage } from './Styles'

export default class SearchPage extends Component {
  static propTypes = {
    searchText: PropTypes.string.isRequired
  }
  render() {
    const { searchText } = this.props
    return <div className={searchPage}>You are searching {searchText}</div>
  }
}
