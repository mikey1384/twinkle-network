import React, { useEffect, useRef, useState } from 'react';
import { useScrollPosition } from 'helpers/hooks';
import PropTypes from 'prop-types';
import AddLinkModal from './AddLinkModal';
import Button from 'components/Button';
import SectionPanel from 'components/SectionPanel';
import LinkGroup from './LinkGroup';
import { connect } from 'react-redux';
import { fetchLinks, fetchMoreLinks } from 'redux/actions/LinkActions';
import { useAppContext } from 'context';

Links.propTypes = {
  fetchLinks: PropTypes.func.isRequired,
  fetchMoreLinks: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  loaded: PropTypes.bool.isRequired,
  loadMoreLinksButtonShown: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired
};

function Links({
  fetchLinks,
  fetchMoreLinks,
  links,
  loaded,
  loadMoreLinksButtonShown,
  location
}) {
  const {
    view: {
      state: { scrollPositions },
      actions: { onRecordScrollPosition }
    },
    requestHelpers: { loadUploads }
  } = useAppContext();
  const [addLinkModalShown, setAddLinkModalShown] = useState(false);
  const mounted = useRef(true);
  const lastId = useRef(null);

  useScrollPosition({
    scrollPositions,
    pathname: location.pathname,
    onRecordScrollPosition,
    currentSection: '/links'
  });

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
        fetchLinks({ links, loadMoreButton });
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
    return fetchMoreLinks({ links, loadMoreButton });
  }
}

export default connect(
  state => ({
    loaded: state.LinkReducer.loaded,
    links: state.LinkReducer.links,
    loadMoreLinksButtonShown: state.LinkReducer.loadMoreLinksButtonShown,
    notificationLoaded: state.NotiReducer.loaded
  }),
  {
    fetchLinks,
    fetchMoreLinks
  }
)(Links);
