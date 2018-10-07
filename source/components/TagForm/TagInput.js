import PropTypes from 'prop-types';
import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import SearchDropdown from '../SearchDropdown';
import Input from 'components/Texts/Input';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from 'emotion';

class TagInput extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClickOutSide: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
    selectedItems: PropTypes.object.isRequired,
    style: PropTypes.object,
    onAddItem: PropTypes.func.isRequired
  };

  handleClickOutside = event => {
    this.props.onClickOutSide();
  };

  state = {
    indexToHighlight: 0
  };

  render() {
    const { className, placeholder, style } = this.props;
    return (
      <div
        className={`${css`
          display: flex;
          align-items: center;
          height: 4.3rem;
          position: relative;
          .addon {
            border: 1px solid ${Color.inputBorderGray()};
            align-self: stretch;
            padding: 0 1rem;
            display: flex;
            align-items: center;
          }
          input {
            height: 100%;
            border: 1px solid ${Color.inputBorderGray()};
            border-left: none;
          }
        `} ${className}`}
        style={style}
      >
        <div className="addon" style={{ background: Color.borderGray() }}>
          <Icon icon="search" />
        </div>
        <Input
          autoFocus={this.props.autoFocus}
          value={this.props.value}
          placeholder={placeholder}
          onChange={text => this.props.onChange(text)}
          onKeyDown={this.onKeyDown}
        />
        {this.renderDropdownList()}
      </div>
    );
  }

  renderDropdownList = () => {
    let { searchResults, selectedItems } = this.props;
    searchResults = searchResults.filter(user => !selectedItems[user.id]);
    return searchResults.length > 0 ? (
      <SearchDropdown
        searchResults={searchResults}
        onUpdate={() => this.setState({ indexToHighlight: 0 })}
        onUnmount={() => this.setState({ indexToHighlight: 0 })}
        indexToHighlight={this.state.indexToHighlight}
        onItemClick={user => this.props.onAddItem(user)}
        renderItemLabel={item => (
          <span>
            {item.username}{' '}
            {item.realName && <small>{`(${item.realName})`}</small>}
          </span>
        )}
      />
    ) : null;
  };

  onKeyDown = event => {
    let { searchResults, selectedItems } = this.props;
    searchResults = searchResults.filter(user => !selectedItems[user.id]);
    const { indexToHighlight } = this.state;
    let index = indexToHighlight;
    if (searchResults.length > 0) {
      if (event.keyCode === 40) {
        event.preventDefault();
        let highlightIndex = Math.min(++index, searchResults.length - 1);
        this.setState({ indexToHighlight: highlightIndex });
      }

      if (event.keyCode === 38) {
        event.preventDefault();
        let highlightIndex = Math.max(--index, 0);
        this.setState({ indexToHighlight: highlightIndex });
      }

      if (event.keyCode === 13) {
        event.preventDefault();
        let user = searchResults[index];
        this.props.onAddItem(user);
      }
    }
  };
}

export default onClickOutside(TagInput);
