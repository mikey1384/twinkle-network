const defaultState = {
  allVideoThumbs: [],
  loadMoreButton: false,
  allVideosLoaded: false,
  addVideoModalShown: false,
  videoPage: {}
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
            videoId: 0
          }
        };
      }
      const videoPageVariables = {
        ...action.data
      };
      return {
        ...state,
        videoPage: videoPageVariables
      }
      case 'EDIT_VIDEO_PAGE':
        if (action.data.success) {
          const description = (action.params.description === '') ?
          'No description' : processedString(action.params.description);
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
        videoPage: {}
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

function processedString(string) {
  var regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  var tempString = string
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\\/g, '\\\\')
  .replace(/\r?\n/g, '<br>')
  .replace(regex,"<a href=\"$1\" target=\"_blank\">$1</a>");
  var newString = "";
  while(tempString.length > 0){
    var position = tempString.indexOf("href=\"");
    if(position === -1){
      newString += tempString;
      break;
    }
    newString += tempString.substring(0, position + 6);
    tempString = tempString.substring(position + 6, tempString.length);
    if (tempString.indexOf("://") > 8 || tempString.indexOf("://") === -1) {
      newString += "http://";
    }
  }
  return newString;
}
