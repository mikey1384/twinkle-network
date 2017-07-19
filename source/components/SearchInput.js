import PropTypes from 'prop-types'
import React, {Component} from 'react'
import SearchDropdown from './SearchDropdown'
import onClickOutside from 'react-onclickoutside'
import Input from 'components/Texts/Input'

class SearchInput extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func,
    onClickOutSide: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    renderItemLabel: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    value: PropTypes.string
  }

  handleClickOutside = (event) => {
    this.props.onClickOutSide()
  }

  constructor() {
    super()
    this.state = {
      indexToHighlight: 0
    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  render() {
    const {placeholder, onChange, onFocus, value} = this.props
    return (
      <div className="input-group dropdown">
        <span className="input-group-addon">
          <span className="glyphicon glyphicon-search"></span>
        </span>
        <Input
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

  renderDropdownList() {
    const {searchResults, renderItemLabel, onSelect} = this.props
    return searchResults.length > 0 ? <SearchDropdown
      searchResults={searchResults}
      onUpdate={() => this.setState({indexToHighlight: 0})}
      onUnmount={() => this.setState({indexToHighlight: 0})}
      indexToHighlight={this.state.indexToHighlight}
      onItemClick={item => onSelect(item)}
      renderItemLabel={renderItemLabel}
    /> : null
  }

  onKeyDown(event) {
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
