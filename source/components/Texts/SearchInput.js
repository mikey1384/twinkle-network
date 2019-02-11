import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import SearchDropdown from '../SearchDropdown';
import { css } from 'emotion';
import { Color } from 'constants/css';
import Input from './Input';
import Icon from 'components/Icon';
import { useOutsideClick } from 'helpers/hooks';

SearchInput.propTypes = {
  addonColor: PropTypes.string,
  autoFocus: PropTypes.bool,
  borderColor: PropTypes.string,
  className: PropTypes.string,
  innerRef: PropTypes.func,
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
};

export default function SearchInput({
  onClickOutSide,
  searchResults = [],
  addonColor,
  autoFocus,
  borderColor,
  className,
  innerRef,
  onChange,
  placeholder,
  onClear,
  onFocus,
  onSelect,
  renderItemLabel,
  renderItemUrl,
  style,
  value
}) {
  const [indexToHighlight, setIndexToHighlight] = useState(0);
  const SearchInputRef = useRef();
  useOutsideClick(SearchInputRef, () => onClickOutSide?.());

  return (
    <div
      className={`${css`
        display: flex;
        align-items: center;
        width: 100%;
        height: 4.3rem;
        position: relative;
        z-index: 1000;
        .addon {
          border: 1px solid ${addonColor || Color.inputBorderGray()};
          align-self: stretch;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          font-size: 1.5rem;
        }
        input {
          height: 100%;
          border: 1px solid ${borderColor || Color.inputBorderGray()};
          border-left: none;
        }
      `} ${className}`}
      ref={SearchInputRef}
      style={style}
    >
      <div
        className="addon"
        style={{ backgroundColor: addonColor || Color.borderGray() }}
      >
        <Icon icon="search" />
      </div>
      <Input
        autoFocus={autoFocus}
        inputRef={innerRef ? ref => innerRef(ref) : () => {}}
        onFocus={onFocus && onFocus}
        placeholder={placeholder}
        value={value}
        onChange={text => onChange(text)}
        onKeyDown={onKeyDown}
      />
      {renderDropdownList()}
    </div>
  );

  function renderDropdownList() {
    return searchResults.length > 0 ? (
      <SearchDropdown
        searchResults={searchResults}
        onUpdate={() => setIndexToHighlight(0)}
        onUnmount={() => setIndexToHighlight(0)}
        indexToHighlight={indexToHighlight}
        onItemClick={item => onSelect(item)}
        renderItemLabel={renderItemLabel}
        renderItemUrl={renderItemUrl}
      />
    ) : null;
  }

  function onKeyDown(event) {
    let index = indexToHighlight;
    if (searchResults.length > 0) {
      if (event.keyCode === 40) {
        event.preventDefault();
        let highlightIndex = Math.min(++index, searchResults.length - 1);
        setIndexToHighlight(highlightIndex);
      }

      if (event.keyCode === 38) {
        event.preventDefault();
        let highlightIndex = Math.max(--index, 0);
        setIndexToHighlight(highlightIndex);
      }

      if (event.keyCode === 13) {
        event.preventDefault();
        let item = searchResults[index];
        onSelect(item);
      }

      if (event.keyCode === 9) {
        onClear?.();
      }
    }
  }
}
