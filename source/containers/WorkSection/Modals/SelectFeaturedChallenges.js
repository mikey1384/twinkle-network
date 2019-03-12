import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ContentListItem from 'components/ContentListItem';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import request from 'axios';
import URL from 'constants/URL';
import Loading from 'components/Loading';
import { objectify } from 'helpers';
import {
  loadContent,
  loadFeeds,
  uploadFeaturedChallenges
} from 'helpers/requestHelpers';
import { queryStringForArray } from 'helpers/stringHelpers';
import { connect } from 'react-redux';

SelectFeaturedChallengesModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

function SelectFeaturedChallengesModal({ dispatch, onHide, onSubmit }) {
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [challengeObjs, setChallengeObjs] = useState({});
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const initialSelected = useRef([]);

  useEffect(() => {
    init();
    async function init() {
      const { data: selectedIds } = await request.get(
        `${URL}/content/featured/challenges/ids`
      );
      setSelected(selectedIds);
      initialSelected.current = selectedIds;
      const {
        data: { feeds, loadMoreButton: loadMoreShown }
      } = await loadFeeds({
        filter: 'post',
        limit: 10
      });
      const challengesArray = [];
      for (let feed of feeds) {
        const challenge = await loadContent({
          contentId: feed.contentId,
          type: feed.type
        });
        challengesArray.push({ ...feed, ...challenge });
      }
      setChallengeObjs(objectify(challengesArray));
      setChallenges(challengesArray.map(challenge => challenge.id));
      setLoadMoreButton(loadMoreShown);
      setLoaded(true);
    }
  }, []);

  return (
    <Modal large onHide={onHide}>
      <header>Select Featured Subjects</header>
      <main>
        {loaded ? (
          challenges.map(challengeId => (
            <ContentListItem
              selectable
              selected={selected.indexOf(challengeId) !== -1}
              key={challengeId}
              style={{ width: '100%' }}
              contentObj={challengeObjs[challengeId]}
              onClick={() =>
                selected.indexOf(challengeId) === -1
                  ? setSelected(selected.concat(challengeId))
                  : setSelected(selected.filter(id => id !== challengeId))
              }
            />
          ))
        ) : (
          <Loading />
        )}
        {loadMoreButton && (
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
        <Button primary onClick={handleSubmit}>
          Done
        </Button>
      </footer>
    </Modal>
  );

  async function handleLoadMore() {
    setLoadingMore(true);
    const {
      data: { feeds, loadMoreButton: loadMoreShown }
    } = await loadFeeds({
      filter: 'post',
      limit: 10,
      shownFeeds: queryStringForArray({
        array: challenges.map(challengeId => challengeObjs[challengeId]),
        originVar: 'feedId',
        destinationVar: 'shownFeeds'
      })
    });
    const challengesArray = [];
    for (let feed of feeds) {
      const challenge = await loadContent({
        contentId: feed.contentId,
        type: feed.type
      });
      challengesArray.push({ ...feed, ...challenge });
    }
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
    await uploadFeaturedChallenges({ dispatch, selected });
    const selectedReversed = [...selected];
    selectedReversed.reverse();
    onSubmit(selectedReversed.map(selectedId => challengeObjs[selectedId]));
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(SelectFeaturedChallengesModal);
