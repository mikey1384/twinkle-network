const defaultState = {
  allVideoThumbs: [],
  loadMoreButton: false,
  allVideosLoaded: false,
  addVideoModalShown: false,

  videoThumbsForPlaylist: [],
  loadMoreButtonForPlaylist: false,
  allVideosLoadedForPlaylist: false
};

export default function VideoReducer(state = defaultState, action) {
  switch(action.type) {
    case 'GET_VIDEOS':
      let loadMoreButton = false;
      let allVideosLoaded = false;
      if (action.res.data.length > 12) {
        action.res.data.pop();
        loadMoreButton = true;
      } else {
        allVideosLoaded = true;
      }
      if (action.initialRun) {
        return {
          ...state,
          allVideoThumbs: action.res.data,
          loadMoreButton,
          allVideosLoaded
        }
      } else {
        return {
          ...state,
          allVideoThumbs: state.allVideoThumbs.concat(action.res.data),
          loadMoreButton,
          allVideosLoaded
        }
      }
    case 'GET_VIDEOS_FOR_PLAYLIST':
      let loadMoreButtonForPlaylist = false;
      let allVideosLoadedForPlaylist = false;
      if (action.res.data.length > 18) {
        action.res.data.pop();
        loadMoreButtonForPlaylist = true;
      } else {
        allVideosLoadedForPlaylist = true;
      }
      if (action.initialRun) {
        return {
          ...state,
          videoThumbsForPlaylist: action.res.data,
          loadMoreButtonForPlaylist,
          allVideosLoadedForPlaylist
        }
      } else {
        return {
          ...state,
          videoThumbsForPlaylist: state.videoThumbsForPlaylist.concat(action.res.data),
          loadMoreButtonForPlaylist,
          allVideosLoadedForPlaylist
        }
      }
    case 'UPLOAD_VIDEO':
      if (action.res.data.result) {
        const newState = [action.res.data.result].concat(state.allVideoThumbs);
        if (!state.allVideosLoaded) {
          newState.pop();
        }
        return {
          ...state,
          allVideoThumbs: newState,
          addVideoModalShown: false
        }
      } else {
        console.log(action.res.data.error);
        return state;
      }
    case 'EDIT_VIDEO_TITLE':
      if (action.res.data.result) {
        const newVideoThumbs = state.allVideoThumbs.map(thumb => {
          if (thumb.id === action.videoId) {
            thumb.title = action.res.data.result;
          }
          return thumb;
        })
        return {
          ...state,
          allVideoThumbs: newVideoThumbs
        }
      } else {
        console.log(action.res.data.error);
        return state;
      }
    case 'DELETE_VIDEO':
      if (action.res.data.result) {
        const newVideoThumbs = state.allVideoThumbs;
        newVideoThumbs.splice(action.arrayNumber, 1);
        return {
          ...state,
          allVideoThumbs: newVideoThumbs.concat(action.res.data.result)
        }
      } else {
        console.log(action.res.data.error);
        return state;
      }
    case 'VID_MODAL_OPEN':
      return {
        ...state,
        addVideoModalShown: true
      };
    case 'VID_MODAL_CLOSE':
      return {
        ...state,
        addVideoModalShown: false
      };
    case 'RESET_VID_STATE':
      return {
        ...state,
        allVideoThumbs: [],
        loadMoreButton: false,
        allVideosLoaded: false,
        addVideoModalShown: false
      }
    case 'RESET_PL_VID_STATE':
      return {
        ...state,
        videoThumbsForPlaylist: [],
        loadMoreButtonForPlaylist: false,
        allVideosLoadedForPlaylist: false
      }
    default:
      return state;
  }
}
