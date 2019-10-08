import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import SearchInput from 'components/Texts/SearchInput';
import { useAppContext, useExploreContext } from 'contexts';

SearchBox.propTypes = {
  category: PropTypes.string,
  className: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  style: PropTypes.object
};

function SearchBox({ category, className, innerRef, style }) {
  const {
    user: {
      state: { profileTheme }
    }
  } = useAppContext();
  const {
    state: {
      search: { searchText }
    },
    actions: { onChangeSearchInput }
  } = useExploreContext();
  return (
    <SearchInput
      className={className}
      style={style}
      addonColor={profileTheme}
      borderColor={profileTheme}
      innerRef={innerRef}
      placeholder={`Search ${category}...`}
      onChange={onChangeSearchInput}
      value={searchText}
    />
  );
}

export default withRouter(SearchBox);
