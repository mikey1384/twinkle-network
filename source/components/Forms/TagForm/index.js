import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import TagInput from './TagInput';
import Tag from './Tag';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { objectify } from 'helpers';

TagForm.propTypes = {
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
  title: PropTypes.string
};

export default function TagForm({
  children,
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
  title
}) {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const timerRef = useRef(null);
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
          {renderTags()}
          <TagInput
            style={{ marginTop: selectedItems.length === 0 ? '1rem' : 0 }}
            autoFocus
            loading={loading}
            value={searchText}
            onChange={onItemSearch}
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

  function onItemSearch(text) {
    clearTimeout(timerRef.current);
    setSearchText(text);
    onClear();
    if (stringIsEmpty(text) || text.length < 2) {
      onNotFound?.({ messageShown: false });
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async() => {
      await onSearch(text);
      setLoading(false);
    }, 300);
  }

  function addItem(item) {
    setSearchText('');
    onAddItem(item);
    onClear();
  }
}
