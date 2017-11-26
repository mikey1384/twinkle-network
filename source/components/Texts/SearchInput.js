import PropTypes from 'prop-types'
import React, {Component} from 'react'
import SearchDropdown from '../SearchDropdown'
import onClickOutside from 'react-onclickoutside'
import Input from './Input'

class SearchInput extends Component {
  static propTypes = {
    addonColor: PropTypes.string,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func,
    onClickOutSide: PropTypes.func,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    placeholder: PropTypes.string,
    renderItemLabel: PropTypes.func,
    renderItemUrl: PropTypes.func,
    searchResults: PropTypes.array,
    style: PropTypes.object,
    value: PropTypes.string
  }

  static defaultProps = {searchResults: []}

  handleClickOutside = (event) => {
    this.props.onClickOutSide ? this.props.onClickOutSide() : null
  }

  state = {
    indexToHighlight: 0
  }

  timer = null

  render() {
    const {addonColor, autoFocus, onChange, placeholder, onFocus, style, value} = this.props
    return (
      <div className="input-group dropdown" style={style}>
        <span className="input-group-addon" style={{backgroundColor: addonColor}}>
          <span className="glyphicon glyphicon-search"></span>
        </span>
        <Input
          autoFocus={autoFocus}
          onFocus={onFocus && onFocus}
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={text => onChange(text)}
          onKeyDown={this.onKeyDown}
        />
        {this.renderDropdownList()}
      </div>
    )
  }

  renderDropdownList = () => {
    const {searchResults, renderItemLabel, renderItemUrl, onSelect} = this.props
    return searchResults.length > 0 ? <SearchDropdown
      searchResults={searchResults}
      onUpdate={() => this.setState({indexToHighlight: 0})}
      onUnmount={() => this.setState({indexToHighlight: 0})}
      indexToHighlight={this.state.indexToHighlight}
      onItemClick={item => onSelect(item)}
      renderItemLabel={renderItemLabel}
      renderItemUrl={renderItemUrl}
    /> : null
  }

  onKeyDown = event => {
    const {indexToHighlight} = this.state
    const {searchResults, onSelect, onClear} = this.props
    let index = indexToHighlight
    if (searchResults.length > 0) {
      if (event.keyCode === 40) {
        event.preventDefault()
        let highlightIndex = Math.min(++index, searchResults.length - 1)
        this.setState({indexToHighlight: highlightIndex})
      }

      if (event.keyCode === 38) {
        event.preventDefault()
        let highlightIndex = Math.max(--index, 0)
        this.setState({indexToHighlight: highlightIndex})
      }

      if (event.keyCode === 13) {
        event.preventDefault()
        let item = searchResults[index]
        onSelect(item)
      }

      if (event.keyCode === 9) {
        if (onClear) onClear()
      }
    }
  }
}

export default onClickOutside(SearchInput)
