import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ExploreActions from './actions';
import ExploreReducer from './reducer';

export const ExploreContext = createContext();
export const initialExploreState = {
  links: {
    loaded: false,
    links: [],
    loadMoreLinksButtonShown: false
  },
  subjects: {
    featured: [],
    loaded: false
  },
  search: {
    results: [],
    loadMoreButton: false,
    searchText: ''
  },
  videos: {
    addPlaylistModalShown: false,
    allPlaylists: [],
    allPlaylistsLoaded: false,
    currentVideoSlot: null,
    featuredPlaylists: [],
    featuredPlaylistsLoaded: false,
    searchedPlaylists: [],
    loadMorePlaylistsButton: false,
    selectPlaylistsToFeatureModalShown: false,
    loadMorePlaylistsToPinButton: false,
    loadMoreSearchedPlaylistsButton: false,
    playlistsToPin: [],
    reorderFeaturedPlaylistsShown: false,
    clickSafe: true
  }
};

ExploreContextProvider.propTypes = {
  children: PropTypes.node
};
export function ExploreContextProvider({ children }) {
  const [exploreState, exploreDispatch] = useReducer(
    ExploreReducer,
    initialExploreState
  );
  return (
    <ExploreContext.Provider
      value={{
        state: exploreState,
        actions: ExploreActions(exploreDispatch)
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
}
