import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SearchInput from 'components/Texts/SearchInput';
import { changeSearch } from 'redux/actions/SearchActions';

class SearchBox extends Component {
  static propTypes = {
    className: PropTypes.string,
    changeSearch: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    searchText: PropTypes.string.isRequired,
    style: PropTypes.object
  };

  render() {
    const { className, onFocus, innerRef, searchText, style } = this.props;
    return (
      <div className={className} style={style}>
        <SearchInput
          innerRef={innerRef}
          placeholder="Search Videos, Subjects, Links, and More"
          onChange={this.onContentSearch}
          value={searchText}
          onFocus={onFocus}
        />
      </div>
    );
  }

  onContentSearch = text => {
    const { changeSearch } = this.props;
    changeSearch(text);
  };
}

export default connect(
  state => ({
    searchText: state.SearchReducer.searchText
  }),
  {
    changeSearch
  }
)(withRouter(SearchBox));
