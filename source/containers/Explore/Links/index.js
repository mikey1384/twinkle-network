import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AddLinkModal from './AddLinkModal';
import Button from 'components/Button';
import SectionPanel from 'components/SectionPanel';
import LinkGroup from './LinkGroup';
import { useScrollPosition } from 'helpers/hooks';
import { useAppContext, useViewContext, useExploreContext } from 'contexts';

Links.propTypes = {
  location: PropTypes.object
};

export default function Links({ location }) {
  const {
    requestHelpers: { loadUploads }
  } = useAppContext();
  const {
    state: {
      links: { loaded, links, loadMoreLinksButtonShown }
    },
    actions: { onFetchLinks, onFetchMoreLinks }
  } = useExploreContext();
  const {
    actions: { onRecordScrollPosition },
    state: { scrollPositions }
  } = useViewContext();
  useScrollPosition({
    onRecordScrollPosition,
    pathname: location.pathname,
    scrollPositions
  });
  const [addLinkModalShown, setAddLinkModalShown] = useState(false);
  const mounted = useRef(true);
  const lastId = useRef(null);

  useEffect(() => {
    if (links.length > 0) {
      lastId.current = links[links.length - 1].id;
    }
  }, [links]);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      if (!loaded) {
        const { results: links, loadMoreButton } = await loadUploads({
          contentType: 'url',
          numberToLoad: 20
        });
        onFetchLinks({ links, loadMoreButton });
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
  }, [loaded]);

  return (
    <div>
      <SectionPanel
        title="All Links"
        button={
          <Button
            skeuomorphic
            color="darkerGray"
            onClick={() => setAddLinkModalShown(true)}
          >
            + Add Link
          </Button>
        }
        emptyMessage="No Uploaded Links"
        isEmpty={links.length === 0}
        emptypMessage="No Links"
        loaded={loaded}
        loadMore={handleLoadMoreLinks}
        loadMoreButtonShown={loadMoreLinksButtonShown}
      >
        <LinkGroup links={links} />
      </SectionPanel>
      {addLinkModalShown && (
        <AddLinkModal onHide={() => setAddLinkModalShown(false)} />
      )}
    </div>
  );

  async function handleLoadMoreLinks() {
    const { results: links, loadMoreButton } = await loadUploads({
      contentType: 'url',
      numberToLoad: 20,
      contentId: lastId.current
    });
    return onFetchMoreLinks({ links, loadMoreButton });
  }
}
