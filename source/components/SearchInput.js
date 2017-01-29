import React, {Component, PropTypes} from 'react'
import SearchDropdown from './SearchDropdown'
import onClickOutside from 'react-onclickoutside'

class SearchInput extends Component {
  static propTypes = {
    renderItemLabel: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    onClickOutSide: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onClear: PropTypes.func
  }

  handleClickOutside = (event) => {
    this.props.onClickOutSide()
  }

  constructor() {
    super()
    this.state = {
      dropdownItemToHighlight: 0
    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  render() {
    const {placeholder, onFocus} = this.props
    return (
      <div className="input-group dropdown">
        <span className="input-group-addon">
          <span className="glyphicon glyphicon-search"></span>
        </span>
        <input
          ref={ref => { this.searchInput = ref }}
          onFocus={onFocus && onFocus}
          className="form-control"
          placeholder={placeholder}
          value={this.props.value}
          onChange={event => this.props.onChange(event)}
          onKeyDown={this.onKeyDown}
        />
        {this.renderDropdownList()}
      </div>
    )
  }

  renderDropdownList() {
    const {searchResults, renderItemLabel, onSelect} = this.props
    return searchResults.length > 0 ? <SearchDropdown
      searchResults={searchResults}
      onUpdate={() => this.setState({dropdownItemToHighlight: 0})}
      onUnmount={() => this.setState({dropdownItemToHighlight: 0})}
      dropdownItemToHighlight={this.state.dropdownItemToHighlight}
      onItemClick={item => onSelect(item)}
      renderItemLabel={renderItemLabel}
    /> : null
  }

  onKeyDown(event) {
    const {dropdownItemToHighlight} = this.state
    const {searchResults, onSelect, onClear} = this.props
    let index = dropdownItemToHighlight
    if (searchResults.length > 0) {
      if (event.keyCode === 40) {
        event.preventDefault()
        let highlightIndex = Math.min(++index, searchResults.length - 1)
        this.setState({dropdownItemToHighlight: highlightIndex})
      }

      if (event.keyCode === 38) {
        event.preventDefault()
        let highlightIndex = Math.max(--index, 0)
        this.setState({dropdownItemToHighlight: highlightIndex})
      }

      if (event.keyCode === 13) {
        event.preventDefault()
        this.searchInput.blur()
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
