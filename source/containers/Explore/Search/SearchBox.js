import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SearchInput from 'components/Texts/SearchInput';
import { changeSearch } from 'redux/actions/SearchActions';

SearchBox.propTypes = {
  category: PropTypes.string,
  className: PropTypes.string,
  changeSearch: PropTypes.func.isRequired,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  profileTheme: PropTypes.string,
  searchText: PropTypes.string.isRequired,
  style: PropTypes.object
};

function SearchBox({
  category,
  changeSearch,
  className,
  innerRef,
  profileTheme,
  searchText,
  style
}) {
  const themeColor = profileTheme || 'logoBlue';
  return (
    <SearchInput
      className={className}
      style={style}
      addonColor={themeColor}
      borderColor={themeColor}
      innerRef={innerRef}
      placeholder={`Search ${category}...`}
      onChange={changeSearch}
      value={searchText}
    />
  );
}

export default connect(
  state => ({
    profileTheme: state.UserReducer.profileTheme,
    searchText: state.SearchReducer.searchText
  }),
  {
    changeSearch
  }
)(withRouter(SearchBox));
