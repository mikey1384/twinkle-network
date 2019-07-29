import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import SearchDropdown from 'components/SearchDropdown';
import Input from 'components/Texts/Input';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useOutsideClick } from 'helpers/hooks';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';

TagInput.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  dropdownTitle: PropTypes.object,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
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

export default function TagInput({
  autoFocus,
  className,
  dropdownTitle,
  inputRef,
  onClickOutSide,
  loading,
  onAddItem,
  onChange,
  onNotFound,
  placeholder,
  renderDropdownLabel,
  searchResults = [],
  selectedItems,
  style,
  value
}) {
  const [results, setResults] = useState(searchResults);
  const [indexToHighlight, setIndexToHighlight] = useState(0);
  const TagInputRef = useRef(null);
  useEffect(() => {
    if (!loading) {
      const shown =
        !loading &&
        searchResults.filter(({ title }) =>
          title ? title.toLowerCase() === value.toLowerCase() : true
        ).length === 0 &&
        !stringIsEmpty(value) &&
        value.length > 1;
      onNotFound?.({ messageShown: shown });
    }
  }, [loading]);
  useEffect(() => {
    setResults(searchResults.filter(item => !selectedItems[item.id]));
  }, [searchResults]);

  useOutsideClick(TagInputRef, onClickOutSide);

  return (
    <ErrorBoundary>
      <div
        className={`${css`
          height: 4.3rem;
          position: relative;
          .addon {
            border: 1px solid ${Color.darkerBorderGray()};
            align-self: stretch;
            padding: 0 1rem;
            display: flex;
            align-items: center;
          }
          input {
            height: 100%;
            border: 1px solid ${Color.darkerBorderGray()};
            border-left: none;
          }
        `} ${className}`}
        ref={TagInputRef}
        style={style}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="addon" style={{ background: Color.borderGray() }}>
            <Icon icon="search" />
          </div>
          <Input
            autoFocus={autoFocus}
            inputRef={inputRef}
            value={value}
            placeholder={placeholder}
            onChange={text => onChange(text)}
            onKeyDown={onKeyDown}
          />
        </div>
        {loading && <Loading style={{ position: 'absolute', top: '1rem' }} />}
        {renderDropdownList()}
      </div>
      {dropdownTitle && (
        <div style={{ marginTop: '0.5rem' }}>{dropdownTitle}</div>
      )}
    </ErrorBoundary>
  );

  function renderDropdownList() {
    return results.length > 0 ? (
      <SearchDropdown
        dropdownTitle={dropdownTitle}
        searchResults={results}
        onUpdate={() => setIndexToHighlight(0)}
        onUnmount={() => setIndexToHighlight(0)}
        indexToHighlight={indexToHighlight}
        onItemClick={onAddItem}
        renderItemLabel={renderDropdownLabel}
      />
    ) : null;
  }

  function onKeyDown(event) {
    searchResults = searchResults.filter(user => !selectedItems[user.id]);
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
        let user = searchResults[index];
        onAddItem(user);
      }
    }
  }
}
