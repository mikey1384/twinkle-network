import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import ContentListItem from 'components/ContentListItem';
import { setResults, showMoreResults } from 'redux/actions/SearchActions';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { searchContent } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import CloseText from './CloseText';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';

Results.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  loadMoreButton: PropTypes.bool.isRequired,
  results: PropTypes.array.isRequired,
  searchText: PropTypes.string.isRequired,
  setResults: PropTypes.func.isRequired,
  showMoreResults: PropTypes.func.isRequired
};

function Results({
  changeFilter,
  closeSearch,
  filter,
  loadMoreButton,
  results,
  searchText,
  setResults,
  showMoreResults
}) {
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const [prevSearchText, setPrevSearchText] = useState(searchText);
  const [prevFilter, setPrevFilter] = useState(filter);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!stringIsEmpty(searchText) && searchText.length > 1) {
      if (firstRun && results.length === 0) {
        setResults({ filter, results: [], loadMoreButton: false });
      }
      setFirstRun(false);
      if ((firstRun && results.length === 0) || searchText !== prevSearchText) {
        clearTimeout(timerRef.current);
        setSearching(true);
        timerRef.current = setTimeout(handleSearchContent, 500);
      }
      setPrevSearchText(searchText);
    }
  }, [searchText]);

  useEffect(() => {
    if (filter !== prevFilter) {
      setSearching(true);
      handleSearchContent();
    }
    setPrevFilter(filter);
  }, [filter]);

  async function handleSearchContent() {
    const data = await searchContent({
      filter,
      searchText
    });
    setResults({ filter, ...data });
    return setSearching(false);
  }

  const availableFilters = ['video', 'url', 'subject'].filter(
    availableFilter => availableFilter !== filter
  );
  return (
    <div
      className={css`
        @media (max-width: ${mobileMaxWidth}) {
          padding-bottom: 30rem;
        }
      `}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center'
      }}
    >
      {searching && <Loading />}
      {!searching &&
        searchText.length > 1 &&
        results.map(result => (
          <ContentListItem
            key={result.id}
            onClick={closeSearch}
            contentObj={result}
          />
        ))}
      {!searching && results.length === 0 && (
        <div
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: Color.darkerGray(),
            justifyContent: 'center',
            height: '40vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ textTransform: 'capitalize' }}>{`No ${
              filter === 'url' ? 'link' : filter
            }s Found`}</p>
            <div style={{ marginTop: '1rem', fontSize: '2rem' }}>
              Search with the same keyword(s) for:
              {availableFilters.map((availableFilter, index) => (
                <p style={{ textTransform: 'capitalize' }} key={index}>
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => changeFilter(availableFilter)}
                  >{`${
                    availableFilter === 'url' ? 'link' : availableFilter
                  }s`}</a>
                </p>
              ))}
            </div>
          </div>
          <CloseText
            text="Or tap to close"
            style={{ marginTop: '3rem', marginBottom: '1rem' }}
          />
        </div>
      )}
      {!searching && loadMoreButton && (
        <div style={{ paddingBottom: '8rem' }}>
          <LoadMoreButton
            filled
            color="lightBlue"
            loading={loadingMore}
            onClick={loadMoreSearchResults}
          />
        </div>
      )}
      {!searching && results.length > 0 && (
        <CloseText
          className="desktop"
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '1rem',
            padding: '1.5rem',
            borderRadius: borderRadius,
            background: Color.lightGray(0.8)
          }}
        />
      )}
    </div>
  );

  async function loadMoreSearchResults() {
    setLoadingMore(true);
    const data = await searchContent({
      filter,
      searchText,
      shownResults: results
    });
    if (data) showMoreResults(data);
    setLoadingMore(false);
  }
}

export default connect(
  state => ({
    loadMoreButton: state.SearchReducer.loadMoreButton,
    results: state.SearchReducer.results
  }),
  { setResults, showMoreResults }
)(Results);
