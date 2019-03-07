import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AddLinkModal from './AddLinkModal';
import Button from 'components/Button';
import SectionPanel from 'components/SectionPanel';
import LinkGroup from './LinkGroup';
import { connect } from 'react-redux';
import { fetchLinks, fetchMoreLinks } from 'redux/actions/LinkActions';

Main.propTypes = {
  fetchLinks: PropTypes.func.isRequired,
  fetchMoreLinks: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired,
  loadMoreLinksButtonShown: PropTypes.bool.isRequired
};

function Main({
  fetchLinks,
  fetchMoreLinks,
  history,
  links,
  loadMoreLinksButtonShown
}) {
  const [addLinkModalShown, setAddLinkModalShown] = useState(false);
  const [loaded, setLoaded] = useState(!!links.length);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      if (!loaded || history.action === 'PUSH') {
        await fetchLinks();
        if (mounted.current) setLoaded(true);
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  return (
    <div>
      <SectionPanel
        title="All Links"
        button={
          <Button snow onClick={() => setAddLinkModalShown(true)}>
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

  function handleLoadMoreLinks() {
    const lastId = links[links.length - 1].id;
    return fetchMoreLinks(lastId);
  }
}

export default connect(
  state => ({
    links: state.LinkReducer.links,
    loadMoreLinksButtonShown: state.LinkReducer.loadMoreLinksButtonShown,
    notificationLoaded: state.NotiReducer.loaded
  }),
  {
    fetchLinks,
    fetchMoreLinks
  }
)(Main);
