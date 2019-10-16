import React, { useEffect, useState } from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ContentListItem from 'components/ContentListItem';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import FilterBar from 'components/FilterBar';
import SearchInput from 'components/Texts/SearchInput';
import { objectify } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext } from 'contexts';

SelectFeaturedSubjectsModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  subjects: PropTypes.array.isRequired
};

export default function SelectFeaturedSubjectsModal({
  subjects,
  onHide,
  onSubmit
}) {
  const {
    requestHelpers: { loadUploads, searchContent, uploadFeaturedSubjects }
  } = useAppContext();
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [searchLoadMoreButton, setSearchLoadMoreButton] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [subjectObj, setSubjectObj] = useState({});
  const [selected, setSelected] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectTabActive, setSelectTabActive] = useState(true);
  const [allSubjects, setAllSubjects] = useState([]);
  const [searchedSubjects, setSearchedSubjects] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { handleSearch, searching } = useSearch({
    onSearch: handleChallengeSearch,
    onClear: () => setSearchedSubjects([]),
    onSetSearchText: setSearchText
  });

  useEffect(() => {
    init();
    async function init() {
      const selectedIds = subjects.map(({ id }) => id);
      setSelected(selectedIds);
      const { results, loadMoreButton: loadMoreShown } = await loadUploads({
        limit: 10,
        contentType: 'subject',
        includeRoot: true
      });
      setSubjectObj({
        ...objectify(results),
        ...objectify(subjects)
      });
      setAllSubjects(results.map(subject => subject.id));
      setLoadMoreButton(loadMoreShown);
      setLoaded(true);
    }
  }, []);

  const displayedSubjects = stringIsEmpty(searchText)
    ? allSubjects
    : searchedSubjects;
  const displayedLoadMoreButton = stringIsEmpty(searchText)
    ? loadMoreButton
    : searchLoadMoreButton;

  return (
    <Modal large onHide={onHide}>
      <header>Select Featured Subjects</header>
      <main>
        <FilterBar style={{ marginBottom: '1.5rem' }}>
          <nav
            className={selectTabActive ? 'active' : ''}
            onClick={() => setSelectTabActive(true)}
          >
            Select
          </nav>
          <nav
            className={!selectTabActive ? 'active' : ''}
            onClick={() => setSelectTabActive(false)}
          >
            Selected
          </nav>
        </FilterBar>
        {selectTabActive && (
          <SearchInput
            autoFocus
            placeholder="Search for playlists to pin"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: '1.5rem' }}
          />
        )}
        {loaded ? (
          <>
            {selectTabActive &&
              (searching ? (
                <Loading />
              ) : displayedSubjects.length === 0 ? (
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '10rem',
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    justifyContent: 'center'
                  }}
                >
                  No Subjects{stringIsEmpty(searchText) ? '' : ' Found'}
                </p>
              ) : (
                displayedSubjects.map(subjectId => (
                  <ContentListItem
                    selectable
                    selected={selected.includes(subjectId)}
                    key={subjectId}
                    style={{ width: '100%', marginBottom: '1rem' }}
                    contentObj={subjectObj[subjectId]}
                    onClick={() => handleSelect(subjectId)}
                  />
                ))
              ))}
            {!selectTabActive &&
              (selected.length === 0 ? (
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '10rem',
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    justifyContent: 'center'
                  }}
                >
                  No Subjects Selected
                </p>
              ) : (
                selected.map((selectedId, index) => (
                  <ContentListItem
                    selectable
                    selected={selected.includes(selectedId)}
                    key={selectedId}
                    style={{
                      width: '100%',
                      marginBottom: index !== selected.length - 1 ? '1rem' : 0
                    }}
                    contentObj={subjectObj[selectedId]}
                    onClick={() => handleSelect(selectedId)}
                  />
                ))
              ))}
          </>
        ) : (
          <Loading />
        )}
        {!searching && displayedLoadMoreButton && selectTabActive && (
          <LoadMoreButton
            style={{ fontSize: '2rem' }}
            transparent
            loading={loadingMore}
            onClick={handleLoadMore}
          />
        )}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={selected.length > 5 || submitting}
          color="blue"
          onClick={handleSubmit}
        >
          {selected.length > 5 ? 'Cannot select more than 5' : 'Done'}
        </Button>
      </footer>
    </Modal>
  );

  async function handleChallengeSearch(text) {
    const { loadMoreButton: loadMoreShown, results } = await searchContent({
      limit: 10,
      filter: 'subject',
      searchText: text
    });
    setSubjectObj(subjectObj => ({
      ...subjectObj,
      ...objectify(results)
    }));
    setSearchedSubjects(results.map(result => result.id));
    setSearchLoadMoreButton(loadMoreShown);
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    const options = stringIsEmpty(searchText)
      ? {
          limit: 10,
          contentType: 'subject',
          includeRoot: true,
          excludeContentIds: allSubjects
        }
      : {
          limit: 10,
          filter: 'subject',
          searchText,
          shownResults: searchedSubjects.map(subjectId => subjectObj[subjectId])
        };
    const method = stringIsEmpty(searchText) ? loadUploads : searchContent;
    const { results, loadMoreButton: loadMoreShown } = await method(options);
    setSubjectObj({
      ...subjectObj,
      ...objectify(results)
    });
    const setSubjectsMethod = stringIsEmpty(searchText)
      ? setAllSubjects
      : setSearchedSubjects;
    setSubjectsMethod(subjects =>
      subjects.concat(results.map(subject => subject.id))
    );
    setLoadingMore(false);
    const setLoadMoreButtonMethod = stringIsEmpty(searchText)
      ? setLoadMoreButton
      : setSearchLoadMoreButton;
    setLoadMoreButtonMethod(loadMoreShown);
  }

  function handleSelect(selectedId) {
    if (selected.includes(selectedId)) {
      setSelected(selected => selected.filter(id => id !== selectedId));
    } else {
      setSelected(selected => [selectedId].concat(selected));
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    await uploadFeaturedSubjects({ selected });
    onSubmit(selected.map(selectedId => subjectObj[selectedId]));
  }
}
