import PropTypes from 'prop-types';
import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import SearchDropdown from 'components/SearchDropdown';
import Input from 'components/Texts/Input';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { stringIsEmpty } from 'helpers/stringHelpers';
import Loading from 'components/Loading';

class TagInput extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    loading: PropTypes.bool,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClickOutSide: PropTypes.func.isRequired,
    onNotFound: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
    selectedItems: PropTypes.object.isRequired,
    style: PropTypes.object,
    onAddItem: PropTypes.func.isRequired,
    renderDropdownLabel: PropTypes.func
  };

  handleClickOutside = event => {
    this.props.onClickOutSide();
  };

  state = {
    indexToHighlight: 0
  };

  componentDidUpdate(prevProps) {
    const { loading, onNotFound, searchResults = [], value } = this.props;
    if (prevProps.loading && !this.props.loading) {
      const shown =
        !loading &&
        searchResults.length === 0 &&
        !stringIsEmpty(value) &&
        value.length > 1;
      onNotFound?.({ messageShown: shown });
    }
  }

  render() {
    const {
      autoFocus,
      loading,
      className,
      onChange,
      placeholder,
      style,
      value
    } = this.props;
    return (
      <div
        className={`${css`
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="addon" style={{ background: Color.borderGray() }}>
            <Icon icon="search" />
          </div>
          <Input
            autoFocus={autoFocus}
            value={value}
            placeholder={placeholder}
            onChange={text => onChange(text)}
            onKeyDown={this.onKeyDown}
          />
        </div>
        {loading && <Loading style={{ position: 'absolute', top: '1rem' }} />}
        {this.renderDropdownList()}
      </div>
    );
  }

  renderDropdownList = () => {
    let {
      onAddItem,
      renderDropdownLabel,
      searchResults,
      selectedItems
    } = this.props;
    searchResults = searchResults.filter(item => !selectedItems[item.id]);
    return searchResults.length > 0 ? (
      <SearchDropdown
        searchResults={searchResults}
        onUpdate={() => this.setState({ indexToHighlight: 0 })}
        onUnmount={() => this.setState({ indexToHighlight: 0 })}
        indexToHighlight={this.state.indexToHighlight}
        onItemClick={onAddItem}
        renderItemLabel={renderDropdownLabel}
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
