import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { searchContent } from 'helpers/requestHelpers'
import { connect } from 'react-redux'

class Results extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    searchText: PropTypes.string.isRequired
  }

  timer = null

  componentDidUpdate(prevProps) {
    const { filter, searchText } = this.props
    if (prevProps.searchText !== searchText || prevProps.filter !== filter) {
      clearTimeout(this.timer)
      this.timer = setTimeout(
        () => this.searchContent({ filter, searchText }),
        300
      )
    }
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <div style={{ width: '80%' }}>ok</div>
      </div>
    )
  }

  searchContent = async({ filter, searchText }) => {
    const { dispatch } = this.props
    const data = await searchContent({ filter, searchText, dispatch })
    console.log(data)
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(Results)
