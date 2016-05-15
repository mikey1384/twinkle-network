import { processedStringWithURL } from 'helpers/StringHelper';

const defaultState = {
  allVideoThumbs: [],
  loadMoreButton: false,
  allVideosLoaded: false,
  addVideoModalShown: false,
  videoPage: {
    comments: [],
    noComments: false
  }
};

export default function VideoReducer(state = defaultState, action) {
  switch(action.type) {
    case 'GET_VIDEOS':
      if (action.videos.error) {
        console.error(action.videos.error);
        return state;
      }
      let loadMoreButton = false;
      let allVideosLoaded = false;
      if (action.videos.length > 12) {
        action.videos.pop();
        loadMoreButton = true;
      } else {
        allVideosLoaded = true;
      }
      if (action.initialRun) {
        return {
          ...state,
          allVideoThumbs: action.videos,
          loadMoreButton,
          allVideosLoaded
        }
      } else {
        return {
          ...state,
          allVideoThumbs: state.allVideoThumbs.concat(action.videos),
          loadMoreButton,
          allVideosLoaded
        }
      }
    case 'UPLOAD_VIDEO':
      if (action.data.result) {
        const newState = [action.data.result].concat(state.allVideoThumbs);
        if (!state.allVideosLoaded) {
          newState.pop();
        }
        return {
          ...state,
          allVideoThumbs: newState,
          addVideoModalShown: false
        }
      } else {
        console.log(action.data.error);
        return state;
      }
    case 'EDIT_VIDEO_TITLE':
      if (action.data.result) {
        const newVideoThumbs = state.allVideoThumbs.map(thumb => {
          if (thumb.id === action.videoId) {
            thumb.title = action.data.result;
          }
          return thumb;
        })
        return {
          ...state,
          allVideoThumbs: newVideoThumbs
        }
      } else {
        console.log(action.data.error);
        return state;
      }
    case 'DELETE_VIDEO':
      if (action.data.result) {
        const newVideoThumbs = state.allVideoThumbs;
        newVideoThumbs.splice(action.arrayNumber, 1);
        return {
          ...state,
          allVideoThumbs: newVideoThumbs.concat(action.data.result)
        }
      } else {
        console.log(action.data.error);
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
    case 'LOAD_VIDEO_PAGE':
      if (action.data.error) {
        console.error(action.data.error);
        return {
          ...state,
          videoPage: {
            videoId: 0,
            comments: []
          }
        };
      }
      const videoPageVariables = {
        ...action.data
      };
      return {
        ...state,
        videoPage: {
          ...videoPageVariables,
          comments: []
        }
      }
    case 'LOAD_VIDEO_PAGE_FROM_CLIENT':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          title: action.data.title,
          description: action.data.description,
          videocode: action.data.videocode
        }
      }
    case 'LOAD_VIDEO_COMMENTS':
      if (action.data.error) {
        console.error(action.data.error);
        return state;
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: action.data.comments,
          noComments: action.data.noComments
        }
      }
    case 'VIDEO_LIKE':
      if (action.data.error) {
        console.error(action.data.error);
        return state;
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          likes: action.data.likes
        }
      }
    case 'UPLOAD_QUESTIONS':
      if (action.data.error) {
        console.error(action.data.error);
        return state;
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          questions: action.data.questions
        }
      }
    case 'EDIT_VIDEO_PAGE':
      if (action.data.success) {
        const description = (action.params.description === '') ?
        'No description' : processedStringWithURL(action.params.description);
        return {
          ...state,
          videoPage: {
            ...state.videoPage,
            title: action.params.title,
            description
          }
        }
      }
      if (action.data.error) {
        console.error(error);
      }
      return state;
    case 'RESET_VIDEO_PAGE':
      return {
        ...state,
        videoPage: {
          comments: [],
          noComments: false
        }
      }
    case 'RESET_VID_STATE':
      return {
        ...state,
        allVideoThumbs: [],
        loadMoreButton: false,
        allVideosLoaded: false,
        addVideoModalShown: false
      }
    default:
      return state;
  }
}
