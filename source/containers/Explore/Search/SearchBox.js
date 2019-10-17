import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'components/Texts/SearchInput';
import { withRouter } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';
import { useExploreContext } from 'contexts';

SearchBox.propTypes = {
  category: PropTypes.string,
  className: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  style: PropTypes.object
};

function SearchBox({ category, className, innerRef, style }) {
  const { profileTheme } = useMyState();
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
