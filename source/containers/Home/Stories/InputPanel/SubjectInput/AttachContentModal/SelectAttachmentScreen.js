import React, { useEffect, useRef, useState } from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import SearchInput from 'components/Texts/SearchInput';
import SelectUploadsForm from 'components/Forms/SelectUploadsForm';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { objectify } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext } from 'contexts';

SelectAttachmentScreen.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onDeselect: PropTypes.func.isRequired,
  contentType: PropTypes.string.isRequired
};

export default function SelectAttachmentScreen({
  onSelect,
  onDeselect,
  contentType
}) {
  const {
    requestHelpers: { loadUploads, searchContent }
  } = useAppContext();
  const [allUploads, setAllUploads] = useState([]);
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [searchedUploads, setSearchedUploads] = useState([]);
  const [searchLoadMoreButton, setSearchLoadMoreButton] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const mounted = useRef(true);
  const contentObjs = useRef({});
  const { handleSearch, searching } = useSearch({
    onSearch,
    onClear: () => setSearchedUploads([]),
    onSetSearchText: setSearchText
  });

  useEffect(() => {
    mounted.current = true;
    initScreen();
    async function initScreen() {
      const { results, loadMoreButton } = await loadUploads({
        limit: 18,
        contentType
      });
      if (mounted.current) {
        setAllUploads(results.map(result => result.id));
        contentObjs.current = objectify(results);
        setLoadMoreButton(loadMoreButton);
        setLoaded(true);
      }
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
        onChange={handleSearch}
      />
      <SelectUploadsForm
        contentObjs={contentObjs.current}
        loading={!loaded || (!stringIsEmpty(searchText) && searching)}
        loadingMore={loadingMore}
        contentType={contentType}
        uploads={!stringIsEmpty(searchText) ? searchedUploads : allUploads}
        selectedUploads={selectedUpload}
        loadMoreButton={
          !stringIsEmpty(searchText) ? searchLoadMoreButton : loadMoreButton
        }
        onSelect={uploadId => {
          setSelectedUpload([uploadId]);
          onSelect(contentObjs.current[uploadId]);
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
    setLoadingMore(true);
    if (!stringIsEmpty(searchText)) {
      const { results, loadMoreButton } = await searchContent({
        filter: contentType,
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
        contentType,
        contentId: allUploads[allUploads.length - 1]
      });
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
      filter: contentType,
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
