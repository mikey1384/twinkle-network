import React, { useState } from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import TagInput from './TagInput';
import Tag from './Tag';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { objectify } from 'helpers';

TagForm.propTypes = {
  dropdownFooter: PropTypes.node,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemLabel: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string.isRequired,
  searchResults: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  filter: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.node
  ]),
  onNotFound: PropTypes.func,
  onSubmit: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  renderDropdownLabel: PropTypes.func.isRequired,
  renderTagLabel: PropTypes.func,
  subTitle: PropTypes.node,
  title: PropTypes.string
};

export default function TagForm({
  children,
  dropdownFooter,
  inputRef,
  filter,
  itemLabel,
  onAddItem,
  onClear,
  searchResults,
  selectedItems,
  onNotFound,
  onRemoveItem,
  onSearch,
  onSubmit,
  renderDropdownLabel,
  renderTagLabel,
  searchPlaceholder,
  subTitle,
  title
}) {
  const [searchText, setSearchText] = useState('');
  const { handleSearch, searching } = useSearch({
    onSearch,
    onEmptyQuery: () => onNotFound?.({ messageShown: false }),
    onClear,
    onSetSearchText: setSearchText
  });
  const filteredResults = searchResults.filter(filter);

  return (
    <ErrorBoundary>
      <form
        style={{ width: '70%' }}
        onSubmit={event => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        <div style={{ width: '100%' }}>
          {title && <h3>{title}</h3>}
          {subTitle && <span>{subTitle}</span>}
          {renderTags()}
          <TagInput
            dropdownFooter={dropdownFooter}
            style={{ marginTop: selectedItems.length === 0 ? '1rem' : 0 }}
            autoFocus
            inputRef={inputRef}
            loading={searching}
            value={searchText}
            onChange={handleSearch}
            onClickOutSide={() => {
              setSearchText('');
              onClear();
            }}
            onNotFound={onNotFound}
            placeholder={searchPlaceholder}
            renderDropdownLabel={renderDropdownLabel}
            searchResults={filteredResults}
            selectedItems={objectify(selectedItems)}
            onAddItem={addItem}
          />
        </div>
        {children}
      </form>
    </ErrorBoundary>
  );

  function renderTags() {
    return selectedItems.length > 0 ? (
      <div
        style={{
          marginTop: '1rem'
        }}
      >
        {selectedItems.map((item, index) => {
          return (
            <Tag
              key={item.id}
              index={index}
              label={item[itemLabel]}
              onClick={() => onRemoveItem(item.id)}
              renderTagLabel={renderTagLabel}
            />
          );
        })}
      </div>
    ) : null;
  }

  function addItem(item) {
    setSearchText('');
    onAddItem(item);
    onClear();
  }
}
