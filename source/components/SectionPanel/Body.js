import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { stringIsEmpty } from 'helpers/stringHelpers';

export default class Body extends Component {
  static propTypes = {
    emptyMessage: PropTypes.string,
    searchQuery: PropTypes.string,
    isSearching: PropTypes.bool,
    isEmpty: PropTypes.bool,
    loadMoreButtonShown: PropTypes.bool,
    statusMsgStyle: PropTypes.string,
    content: PropTypes.node
  };
  render() {
    const {
      emptyMessage,
      searchQuery,
      isSearching,
      isEmpty,
      statusMsgStyle,
      content,
      loadMoreButtonShown
    } = this.props;
    return (
      <div>
        {(!stringIsEmpty(searchQuery) && isSearching) ||
        (isEmpty && !loadMoreButtonShown) ? (
          <div className={statusMsgStyle}>
            {searchQuery && isSearching
              ? 'Searching...'
              : searchQuery
              ? 'No Results'
              : emptyMessage}
          </div>
        ) : (
          content
        )}
      </div>
    );
  }
}
