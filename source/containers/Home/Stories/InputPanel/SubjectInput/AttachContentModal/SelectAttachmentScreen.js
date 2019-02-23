import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'components/Texts/SearchInput';
import SelectUploadsForm from 'components/Forms/SelectUploadsForm';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { loadUploads, searchContent } from 'helpers/requestHelpers';

SelectAttachmentScreen.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onDeselect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export default function SelectAttachmentScreen({ onSelect, onDeselect, type }) {
  const [allUploads, setAllUploads] = useState([]);
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [searchedUploads, setSearchedUploads] = useState([]);
  const [searchLoadMoreButton, setSearchLoadMoreButton] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedUpload, setSelectedUpload] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    initScreen();
    async function initScreen() {
      const { results, loadMoreButton } = await loadUploads({
        limit: 18,
        type
      });
      setAllUploads(results);
      setLoadMoreButton(loadMoreButton);
      setLoaded(true);
    }
  }, []);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <SearchInput
        placeholder="Search..."
        autoFocus
        style={{
          marginBottom: '2em',
          width: '50%'
        }}
        value={searchText}
        onChange={onSearchInput}
      />
      <SelectUploadsForm
        loading={!loaded || (!stringIsEmpty(searchText) && searching)}
        type={type}
        uploads={!stringIsEmpty(searchText) ? searchedUploads : allUploads}
        selectedUploads={selectedUpload}
        loadMoreButton={
          !stringIsEmpty(searchText) ? searchLoadMoreButton : loadMoreButton
        }
        onSelect={upload => {
          setSelectedUpload([upload]);
          onSelect(upload);
        }}
        onDeselect={() => {
          setSelectedUpload([]);
          onDeselect();
        }}
        loadMoreUploads={loadMoreUploads}
      />
    </ErrorBoundary>
  );

  async function loadMoreUploads() {
    if (!stringIsEmpty(searchText)) {
      const { results, loadMoreButton } = await searchContent({
        filter: type,
        searchText,
        shownResults: searchedUploads
      });
      setSearchedUploads(searchedUploads.concat(results));
      setSearchLoadMoreButton(loadMoreButton);
    } else {
      const { results, loadMoreButton } = await loadUploads({
        limit: 18,
        type,
        contentId: allUploads[allUploads.length - 1].id
      });
      setAllUploads(allUploads.concat(results));
      setLoadMoreButton(loadMoreButton);
    }
  }

  function onSearchInput(text) {
    clearTimeout(timerRef.current);
    setSearchText(text);
    setSearching(true);
    setSearchedUploads([]);
    timerRef.current = setTimeout(() => search(text), 300);
    async function search(text) {
      const { results: searchedUploads, loadMoreButton } = await searchContent({
        filter: type,
        searchText: text
      });
      setSearching(false);
      setSearchedUploads(searchedUploads);
      setSearchLoadMoreButton(loadMoreButton);
    }
  }
}
