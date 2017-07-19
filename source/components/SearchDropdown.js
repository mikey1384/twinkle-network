import PropTypes from 'prop-types'
import React, {Component} from 'react'

export default class Dropdown extends Component {
  static propTypes = {
    className: PropTypes.string,
    indexToHighlight: PropTypes.number.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onUnmount: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    renderItemLabel: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    startingIndex: PropTypes.number,
    style: PropTypes.object
  }

  componentWillReceiveProps(nextProps) {
    const {startingIndex = 0} = this.props
    let searchResultsChanged = false
    if (this.props.searchResults.length !== nextProps.searchResults.length) {
      searchResultsChanged = true
    } else {
      for (let i = 0; i < nextProps.searchResults.length; i++) {
        if (nextProps.searchResults[i] !== this.props.searchResults[i]) {
          searchResultsChanged = true
        }
      }
    }

    if (searchResultsChanged && (nextProps.indexToHighlight > startingIndex)) {
      this.props.onUpdate()
    }
  }

  componentWillUnmount() {
    this.props.onUnmount()
  }

  render() {
    const {searchResults, indexToHighlight, style, className = 'dropdown-menu'} = this.props
    return (
      <ul
        className={className}
        style={{
          width: '100%',
          cursor: 'pointer',
          display: 'block',
          ...style
        }}
      >
        {searchResults.map((item, index) => {
          let itemStyle = index === indexToHighlight ?
            {background: '#f5f5f5', color: '#333333'} : null
          return (
            <li
              key={index}
              onClick={() => this.props.onItemClick(item)}
            >
              <a style={{
                ...itemStyle,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                lineHeight: 'normal'
              }}>
                {this.props.renderItemLabel(item)}
              </a>
            </li>
          )
        })}
      </ul>
    )
  }
}
