import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import SelectUploadsForm from 'components/Forms/SelectUploadsForm';
import SearchInput from 'components/Texts/SearchInput';
import { objectify } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext, useContentContext } from 'contexts';
import { useSearch } from 'helpers/hooks';

SelectVideoModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired
};

export default function SelectVideoModal({ onSend, onHide }) {
  const {
    requestHelpers: { loadUploads, searchContent }
  } = useAppContext();
  const {
    actions: { onInitContent }
  } = useContentContext();
  const [searchedUploads, setSearchedUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState([]);
  const [allUploads, setAllUploads] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [searchLoadMoreButton, setSearchLoadMoreButton] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { handleSearch, searching } = useSearch({
    onSearch,
    onClear: () => setSearchedUploads([]),
    onSetSearchText: setSearchText
  });
  const mounted = useRef(true);
  const contentObjs = useRef({});
  useEffect(() => {
    mounted.current = true;
    initScreen();
    async function initScreen() {
      const { results, loadMoreButton } = await loadUploads({
        limit: 18,
        contentType: 'video'
      });
      if (mounted.current) {
        for (let result of results) {
          onInitContent({
            contentId: result.id,
            contentType: 'video',
            ...result
          });
        }
        setAllUploads(results.map(result => result.id));
        contentObjs.current = objectify(results);
        setLoadMoreButton(loadMoreButton);
        setLoaded(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal large onHide={onHide}>
      <header>Send a Video</header>
      <main>
        <SearchInput
          placeholder="Search..."
          autoFocus
          style={{
            marginBottom: '2em',
            width: '50%'
          }}
          value={searchText}
          onChange={handleSearch}
        />
        <SelectUploadsForm
          contentObjs={contentObjs.current}
          loading={!loaded || (!stringIsEmpty(searchText) && searching)}
          loadingMore={loadingMore}
          contentType="video"
          uploads={!stringIsEmpty(searchText) ? searchedUploads : allUploads}
          selectedUploads={selectedUpload}
          loadMoreButton={
            !stringIsEmpty(searchText) ? searchLoadMoreButton : loadMoreButton
          }
          onSelect={uploadId => {
            setSelectedUpload([uploadId]);
          }}
          onDeselect={() => {
            setSelectedUpload([]);
          }}
          loadMoreUploads={loadMoreUploads}
        />
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={selectedUpload.length === 0}
          color="blue"
          style={{ marginLeft: '0.7rem' }}
          onClick={() => onSend(selectedUpload?.[0])}
        >
          Send
        </Button>
      </footer>
    </Modal>
  );

  async function loadMoreUploads() {
    setLoadingMore(true);
    if (!stringIsEmpty(searchText)) {
      const { results, loadMoreButton } = await searchContent({
        filter: 'video',
        searchText,
        shownResults: searchedUploads.map(
          uploadId => contentObjs.current[uploadId]
        )
      });
      contentObjs.current = {
        ...contentObjs.current,
        ...objectify(results)
      };
      setSearchedUploads(searchedUploads =>
        searchedUploads.concat(results.map(result => result.id))
      );
      setLoadingMore(false);
      setSearchLoadMoreButton(loadMoreButton);
    } else {
      const { results, loadMoreButton } = await loadUploads({
        limit: 18,
        contentType: 'video',
        contentId: allUploads[allUploads.length - 1]
      });
      for (let result of results) {
        onInitContent({
          contentId: result.id,
          contentType: 'video',
          ...result
        });
      }
      contentObjs.current = {
        ...contentObjs.current,
        ...objectify(results)
      };
      setAllUploads(allUploads =>
        allUploads.concat(results.map(result => result.id))
      );
      setLoadingMore(false);
      setLoadMoreButton(loadMoreButton);
    }
  }

  async function onSearch(text) {
    const { results: searchedUploads, loadMoreButton } = await searchContent({
      filter: 'video',
      searchText: text
    });
    contentObjs.current = {
      ...contentObjs.current,
      ...objectify(searchedUploads)
    };
    setSearchedUploads(searchedUploads.map(upload => upload.id));
    setSearchLoadMoreButton(loadMoreButton);
  }
}
