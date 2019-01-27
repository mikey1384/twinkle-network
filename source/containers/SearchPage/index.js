import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { searchPage } from './Styles';
import TopFilter from './TopFilter';
import FirstPage from './FirstPage';
import Checkbox from 'components/Checkbox';
import Results from './Results';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { setDefaultSearchFilter } from 'helpers/requestHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import {
  changeFilter,
  closeSearch,
  recordSearchScroll,
  setResults
} from 'redux/actions/SearchActions';
import { updateDefaultSearchFilter } from 'redux/actions/UserActions';
import { connect } from 'react-redux';
import { css } from 'emotion';
import CloseText from './CloseText';

class SearchPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    changeFilter: PropTypes.func.isRequired,
    closeSearch: PropTypes.func.isRequired,
    onSearchBoxFocus: PropTypes.func.isRequired,
    recordSearchScroll: PropTypes.func.isRequired,
    searchFilter: PropTypes.string,
    searchScrollPosition: PropTypes.number,
    searchText: PropTypes.string.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    setResults: PropTypes.func.isRequired,
    userId: PropTypes.number
  };

  componentDidMount() {
    const {
      selectedFilter,
      searchFilter,
      changeFilter,
      searchScrollPosition
    } = this.props;
    if (!selectedFilter) changeFilter(searchFilter || 'video');
    setTimeout(() => {
      this.SearchPage.scrollTop = searchScrollPosition;
    }, 10);
  }

  componentDidUpdate(prevProps) {
    const { searchText, setResults } = this.props;
    if (
      !stringIsEmpty(prevProps.searchText) &&
      prevProps.searchText.length >= 2 &&
      (stringIsEmpty(searchText) || searchText.length < 2)
    ) {
      setResults({ results: [], loadMoreButton: false });
    }
  }

  componentWillUnmount() {
    const { recordSearchScroll } = this.props;
    recordSearchScroll(this.SearchPage.scrollTop);
  }

  render() {
    const {
      changeFilter,
      closeSearch,
      onSearchBoxFocus,
      selectedFilter,
      searchFilter,
      searchText,
      userId
    } = this.props;
    return (
      <div ref={ref => (this.SearchPage = ref)} className={searchPage}>
        <div
          className={css`
            width: 80%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              margin: 0 1rem 0 1rem;
            }
          `}
        >
          <CloseText className="desktop" />
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              padding: '1rem',
              color: Color.darkerGray()
            }}
          >
            {stringIsEmpty(searchText) ? (
              <div style={{ textTransform: 'capitalize' }}>
                {this.renderHelperText()}
              </div>
            ) : (
              <span>
                <span style={{ textTransform: 'capitalize' }}>
                  {selectedFilter === 'url' ? 'link' : selectedFilter}
                </span>
                : {`"${searchText}"`}
              </span>
            )}
            {userId && (
              <Checkbox
                label="Default:"
                backgroundColor="#fff"
                checked={selectedFilter === searchFilter}
                onClick={this.setDefaultSearchFilter}
              />
            )}
          </div>
          <TopFilter
            applyFilter={changeFilter}
            selectedFilter={selectedFilter}
          />
          {stringIsEmpty(searchText) ? (
            <FirstPage
              changeFilter={changeFilter}
              defaultFilter={searchFilter}
              filter={selectedFilter}
              setDefaultSearchFilter={this.setDefaultSearchFilter}
              onSearchBoxFocus={onSearchBoxFocus}
            />
          ) : (
            <Results
              changeFilter={changeFilter}
              closeSearch={closeSearch}
              searchText={searchText}
              filter={selectedFilter}
            />
          )}
        </div>
      </div>
    );
  }

  renderHelperText = () => {
    const { selectedFilter } = this.props;
    if (selectedFilter === 'all') return 'Search all content type...';
    if (selectedFilter === 'url') return 'Search links...';
    return `Search ${selectedFilter}s...`;
  };

  setDefaultSearchFilter = async() => {
    const {
      dispatch,
      searchFilter,
      selectedFilter,
      updateDefaultSearchFilter
    } = this.props;
    if (selectedFilter === searchFilter) return;
    await setDefaultSearchFilter({
      filter: selectedFilter,
      dispatch
    });
    updateDefaultSearchFilter(selectedFilter);
  };
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    searchFilter: state.UserReducer.searchFilter,
    searchScrollPosition: state.SearchReducer.searchScrollPosition,
    selectedFilter: state.SearchReducer.selectedFilter
  }),
  dispatch => ({
    dispatch,
    changeFilter: filter => dispatch(changeFilter(filter)),
    closeSearch: () => dispatch(closeSearch()),
    recordSearchScroll: scrollTop => dispatch(recordSearchScroll(scrollTop)),
    setResults: data => dispatch(setResults(data)),
    updateDefaultSearchFilter: filter =>
      dispatch(updateDefaultSearchFilter(filter))
  })
)(SearchPage);
