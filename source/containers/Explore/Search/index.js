import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { setDefaultSearchFilter } from 'helpers/requestHelpers';
import { mobileMaxWidth } from 'constants/css';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { getSectionFromPathname } from 'helpers';
import TopFilter from './TopFilter';
import Categories from './Categories';
import Results from './Results';
import SearchBox from './SearchBox';
import { Context } from 'context';
import { updateDefaultSearchFilter } from 'redux/actions/UserActions';

Search.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  defaultSearchFilter: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  style: PropTypes.object,
  updateDefaultSearchFilter: PropTypes.func.isRequired
};

function Search({
  dispatch,
  defaultSearchFilter,
  history,
  pathname,
  style,
  updateDefaultSearchFilter
}) {
  const {
    explore: {
      state: {
        search: { searchText }
      },
      actions: { onLoadSearchResults }
    }
  } = useContext(Context);
  const category = getSectionFromPathname(pathname)?.section;
  const prevSearchText = useRef(searchText);
  const SearchBoxRef = useRef(null);
  useEffect(() => {
    if (
      !stringIsEmpty(prevSearchText.current) &&
      prevSearchText.current.length >= 2 &&
      (stringIsEmpty(searchText) || searchText.length < 2)
    ) {
      onLoadSearchResults({ results: [], loadMoreButton: false });
    }
    prevSearchText.current = searchText;
  }, [searchText]);

  return (
    <div style={style}>
      {stringIsEmpty(searchText) && (
        <Categories
          style={{ marginTop: '7rem', marginBottom: '4rem' }}
          defaultFilter={defaultSearchFilter}
          filter={category}
          setDefaultSearchFilter={handleSetDefaultSearchFilter}
        />
      )}
      <SearchBox
        style={{
          width: '50%',
          marginTop: '2rem',
          height: '5rem'
        }}
        category={category}
        className={css`
          svg,
          input {
            font-size: 2.3rem;
          }
        `}
        innerRef={SearchBoxRef}
      />
      {!stringIsEmpty(searchText) && (
        <>
          <TopFilter
            className={css`
              width: 100%;
              margin-top: 2rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-top: 0;
                border-top: 0;
              }
            `}
            history={history}
            selectedFilter={category}
          />
          <Results searchText={searchText} filter={category} />
        </>
      )}
    </div>
  );

  async function handleSetDefaultSearchFilter() {
    if (category === defaultSearchFilter) return;
    await setDefaultSearchFilter({
      filter: category,
      dispatch
    });
    updateDefaultSearchFilter(category);
    if (stringIsEmpty(searchText)) {
      SearchBoxRef.current.focus();
    }
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    defaultSearchFilter: state.UserReducer.searchFilter
  }),
  dispatch => ({
    dispatch,
    updateDefaultSearchFilter: params =>
      dispatch(updateDefaultSearchFilter(params))
  })
)(Search);
