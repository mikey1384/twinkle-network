import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SearchInput from 'components/Texts/SearchInput';
import { useAppContext } from 'context';

SearchBox.propTypes = {
  category: PropTypes.string,
  className: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  profileTheme: PropTypes.string,
  style: PropTypes.object
};

function SearchBox({ category, className, innerRef, profileTheme, style }) {
  const {
    explore: {
      state: {
        search: { searchText }
      },
      actions: { onChangeSearchInput }
    }
  } = useAppContext();
  const themeColor = profileTheme || 'logoBlue';
  return (
    <SearchInput
      className={className}
      style={style}
      addonColor={themeColor}
      borderColor={themeColor}
      innerRef={innerRef}
      placeholder={`Search ${category}...`}
      onChange={onChangeSearchInput}
      value={searchText}
    />
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(withRouter(SearchBox));
