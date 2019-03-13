import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ContentListItem from 'components/ContentListItem';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import FilterBar from 'components/FilterBar';
import { objectify } from 'helpers';
import { loadUploads, uploadFeaturedChallenges } from 'helpers/requestHelpers';
import { connect } from 'react-redux';

SelectFeaturedChallengesModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedChallenges: PropTypes.array.isRequired
};

function SelectFeaturedChallengesModal({
  dispatch,
  selectedChallenges,
  onHide,
  onSubmit
}) {
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [challengeObjs, setChallengeObjs] = useState({});
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectTabActive, setSelectTabActive] = useState(true);

  useEffect(() => {
    init();
    async function init() {
      const selectedIds = selectedChallenges.map(({ id }) => id);
      setSelected(selectedIds);
      const {
        results: challengesArray,
        loadMoreButton: loadMoreShown
      } = await loadUploads({
        limit: 10,
        type: 'subject',
        includeRoot: true
      });
      setChallengeObjs({
        ...objectify(challengesArray),
        ...objectify(selectedChallenges)
      });
      setChallenges(challengesArray.map(challenge => challenge.id));
      setLoadMoreButton(loadMoreShown);
      setLoaded(true);
    }
  }, []);

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
        {loaded ? (
          <>
            {selectTabActive &&
              (challenges.length === 0 ? (
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
                  No Subjects
                </p>
              ) : (
                challenges.map(challengeId => (
                  <ContentListItem
                    selectable
                    selected={selected.indexOf(challengeId) !== -1}
                    key={challengeId}
                    style={{ width: '100%' }}
                    contentObj={challengeObjs[challengeId]}
                    onClick={() =>
                      selected.indexOf(challengeId) === -1
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
                selected.map(selectedId => (
                  <ContentListItem
                    selectable
                    selected={selected.indexOf(selectedId) !== -1}
                    key={selectedId}
                    style={{ width: '100%' }}
                    contentObj={challengeObjs[selectedId]}
                    onClick={() =>
                      selected.indexOf(selectedId) === -1
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
        {loadMoreButton && selectTabActive && (
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
          primary
          onClick={handleSubmit}
        >
          {selected.length > 5 ? 'Cannot select more than 5' : 'Done'}
        </Button>
      </footer>
    </Modal>
  );

  async function handleLoadMore() {
    setLoadingMore(true);
    const {
      results: challengesArray,
      loadMoreButton: loadMoreShown
    } = await loadUploads({
      limit: 10,
      type: 'subject',
      includeRoot: true,
      excludeContentIds: challenges.map(challengeId => challengeId)
    });
    setChallengeObjs({
      ...challengeObjs,
      ...objectify(challengesArray)
    });
    setChallenges(
      challenges.concat(challengesArray.map(challenge => challenge.id))
    );
    setLoadingMore(false);
    setLoadMoreButton(loadMoreShown);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await uploadFeaturedChallenges({ dispatch, selected });
    onSubmit(selected.map(selectedId => challengeObjs[selectedId]));
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(SelectFeaturedChallengesModal);
