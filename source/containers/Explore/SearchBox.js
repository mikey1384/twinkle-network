import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SearchInput from 'components/Texts/SearchInput';
import { changeSearch } from 'redux/actions/SearchActions';

SearchBox.propTypes = {
  className: PropTypes.string,
  changeSearch: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  profileTheme: PropTypes.string,
  searchText: PropTypes.string.isRequired,
  style: PropTypes.object
};

function SearchBox({
  changeSearch,
  className,
  onFocus,
  innerRef,
  profileTheme,
  searchText,
  style
}) {
  const themeColor = profileTheme || 'logoBlue';
  return (
    <div className={className} style={style}>
      <SearchInput
        addonColor={themeColor}
        borderColor={themeColor}
        innerRef={innerRef}
        placeholder="Search Videos, Subjects, Links, and More"
        onChange={changeSearch}
        value={searchText}
        onFocus={onFocus}
      />
    </div>
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
