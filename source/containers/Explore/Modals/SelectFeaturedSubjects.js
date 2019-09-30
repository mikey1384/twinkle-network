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
  const [challengeObjs, setChallengeObjs] = useState({});
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectTabActive, setSelectTabActive] = useState(true);
  const [searchedChallenges, setSearchedChallenges] = useState([]);
  const { handleSearch, searchText, searching } = useSearch({
    onSearch: handleChallengeSearch,
    onClear: () => setSearchedChallenges([])
  });

  useEffect(() => {
    init();
    async function init() {
      const selectedIds = subjects.map(({ id }) => id);
      setSelected(selectedIds);
      const {
        results: challengesArray,
        loadMoreButton: loadMoreShown
      } = await loadUploads({
        limit: 10,
        contentType: 'subject',
        includeRoot: true
      });
      setChallengeObjs({
        ...objectify(challengesArray),
        ...objectify(subjects)
      });
      setChallenges(challengesArray.map(challenge => challenge.id));
      setLoadMoreButton(loadMoreShown);
      setLoaded(true);
    }
  }, []);

  const displayedChallenges = stringIsEmpty(searchText)
    ? challenges
    : searchedChallenges;
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
              ) : displayedChallenges.length === 0 ? (
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
                displayedChallenges.map(challengeId => (
                  <ContentListItem
                    selectable
                    selected={selected.includes(challengeId)}
                    key={challengeId}
                    style={{ width: '100%', marginBottom: '1rem' }}
                    contentObj={challengeObjs[challengeId]}
                    onClick={() =>
                      !selected.includes(challengeId)
                        ? setSelected([challengeId].concat(selected))
                        : setSelected(selected.filter(id => id !== challengeId))
                    }
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
                    contentObj={challengeObjs[selectedId]}
                    onClick={() =>
                      !selected.includes(selectedId)
                        ? setSelected([selectedId].concat(selected))
                        : setSelected(selected.filter(id => id !== selectedId))
                    }
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
    setChallengeObjs(challengeObjs => ({
      ...challengeObjs,
      ...objectify(results)
    }));
    setSearchedChallenges(results.map(result => result.id));
    setSearchLoadMoreButton(loadMoreShown);
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    const options = stringIsEmpty(searchText)
      ? {
          limit: 10,
          contentType: 'subject',
          includeRoot: true,
          excludeContentIds: challenges
        }
      : {
          limit: 10,
          filter: 'subject',
          searchText,
          shownResults: searchedChallenges.map(
            challengeId => challengeObjs[challengeId]
          )
        };
    const method = stringIsEmpty(searchText) ? loadUploads : searchContent;
    const {
      results: challengesArray,
      loadMoreButton: loadMoreShown
    } = await method(options);
    setChallengeObjs({
      ...challengeObjs,
      ...objectify(challengesArray)
    });
    const setChallengesMethod = stringIsEmpty(searchText)
      ? setChallenges
      : setSearchedChallenges;
    setChallengesMethod(challenges =>
      challenges.concat(challengesArray.map(challenge => challenge.id))
    );
    setLoadingMore(false);
    const setLoadMoreButtonMethod = stringIsEmpty(searchText)
      ? setLoadMoreButton
      : setSearchLoadMoreButton;
    setLoadMoreButtonMethod(loadMoreShown);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await uploadFeaturedSubjects({ selected });
    onSubmit(selected.map(selectedId => challengeObjs[selectedId]));
  }
}
