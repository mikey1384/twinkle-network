import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Color } from 'constants/css'
import { css } from 'emotion'

export default class Dropdown extends Component {
  static propTypes = {
    className: PropTypes.string,
    indexToHighlight: PropTypes.number.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onUnmount: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    renderItemLabel: PropTypes.func.isRequired,
    renderItemUrl: PropTypes.func,
    searchResults: PropTypes.array.isRequired,
    startingIndex: PropTypes.number,
    style: PropTypes.object
  }

  componentDidUpdate(prevProps) {
    const {
      indexToHighlight,
      startingIndex = 0,
      searchResults,
      onUpdate
    } = this.props
    let searchResultsChanged = false
    if (prevProps.searchResults.length !== searchResults.length) {
      searchResultsChanged = true
    } else {
      for (let i = 0; i < searchResults.length; i++) {
        if (searchResults[i] !== prevProps.searchResults[i]) {
          searchResultsChanged = true
        }
      }
    }

    if (searchResultsChanged && indexToHighlight > startingIndex) {
      onUpdate()
    }
  }

  componentWillUnmount() {
    this.props.onUnmount()
  }

  render() {
    const {
      searchResults,
      indexToHighlight,
      style = {},
      onItemClick,
      renderItemLabel,
      renderItemUrl
    } = this.props
    return (
      <div
        className={css`
          position: absolute;
          top: 1rem;
          left: 0;
          right: 0;
          background: #fff;
          box-shadow: 1px 1px 5px ${Color.black()};
          top: CALC(4.3rem - 1px);
        `}
        style={style}
      >
        <div
          className={css`
            width: 100%;
            cursor: pointer;
            display: block;
            nav {
              padding: 1rem;
              color: ${Color.darkGray()};
              &:hover {
                background: ${Color.headingGray()};
              }
              a {
                text-decoration: none;
                color: ${Color.darkGray()};
              }
            }
          `}
        >
          {searchResults.map((item, index) => {
            let itemStyle =
              index === indexToHighlight
                ? { background: Color.headingGray() }
                : {}
            const href = renderItemUrl ? { href: renderItemUrl(item) } : {}
            return (
              <nav
                key={index}
                style={{
                  width: '100%',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  ...itemStyle
                }}
                onClick={() => onItemClick(item)}
              >
                <a
                  {...href}
                  style={{
                    lineHeight: 'normal'
                  }}
                  onClick={e => e.preventDefault()}
                >
                  {renderItemLabel(item)}
                </a>
              </nav>
            )
          })}
        </div>
      </div>
    )
  }
}
