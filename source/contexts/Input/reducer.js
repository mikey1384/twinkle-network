import { initialInputState } from '.';

export default function InputReducer(state, action) {
  const contentKey =
    action.contentType && action.contentId
      ? action.contentType + action.contentId
      : 'temp';
  switch (action.type) {
    case 'ENTER_COMMENT':
      return {
        ...state,
        [contentKey]: action.text
      };
    case 'SET_CONTENT_ALREADY_POSTED':
      return {
        ...state,
        content: {
          ...state.content,
          alreadyPosted: action.alreadyPosted
        }
      };
    case 'SET_CONTENT_DESCRIPTION_FIELD_SHOWN':
      return {
        ...state,
        content: {
          ...state.content,
          descriptionFieldShown: action.shown
        }
      };
    case 'SET_CONTENT_DESCRIPTION':
      return {
        ...state,
        content: {
          ...state.content,
          form: {
            ...state.content.form,
            description: action.description
          }
        }
      };
    case 'SET_CONTENT_IS_VIDEO':
      return {
        ...state,
        content: {
          ...state.content,
          form: {
            ...state.content.form,
            isVideo: action.isVideo
          }
        }
      };
    case 'SET_CONTENT_REWARD_LEVEL':
      return {
        ...state,
        content: {
          ...state.content,
          form: {
            ...state.content.form,
            rewardLevel: action.rewardLevel
          }
        }
      };
    case 'SET_CONTENT_TITLE':
      return {
        ...state,
        content: {
          ...state.content,
          form: {
            ...state.content.form,
            title: action.title
          }
        }
      };
    case 'SET_CONTENT_TITLE_FIELD_SHOWN':
      return {
        ...state,
        content: {
          ...state.content,
          titleFieldShown: action.shown
        }
      };
    case 'SET_CONTENT_URL':
      return {
        ...state,
        content: {
          ...state.content,
          form: {
            ...state.content.form,
            url: action.url
          }
        }
      };
    case 'SET_CONTENT_URL_ERROR':
      return {
        ...state,
        content: {
          ...state.content,
          urlError: action.urlError
        }
      };
    case 'SET_CONTENT_URL_HELPER':
      return {
        ...state,
        content: {
          ...state.content,
          urlHelper: action.urlHelper
        }
      };
    case 'SET_EDITED_EMAIL':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          editedEmail: action.editedEmail
        }
      };
    case 'SET_EDITED_PROFILE_TITLE':
      return {
        ...state,
        editedProfileTitle: action.editedProfileTitle
      };
    case 'SET_EDITED_STATUS_COLOR':
      return {
        ...state,
        editedStatusColor: action.editedStatusColor
      };
    case 'SET_EDITED_STATUS_MSG':
      return {
        ...state,
        editedStatusMsg: action.editedStatusMsg
      };
    case 'SET_EDITED_WEBSITE':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          editedWebsite: action.editedWebsite
        }
      };
    case 'SET_EDITED_YOUTUBE_NAME':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          editedYoutubeName: action.editedYoutubeName
        }
      };
    case 'SET_EDITED_YOUTUBE_URL':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          editedYoutubeUrl: action.editedYoutubeUrl
        }
      };
    case 'SET_EDIT_FORM':
      return {
        ...state,
        ['edit' + contentKey]: action.form
          ? {
              ...(state['edit' + contentKey] || {}),
              ...action.form
            }
          : undefined
      };
    case 'SET_EMAIL_ERROR':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          emailError: action.emailError
        }
      };
    case 'SET_HAS_SECRET_ANSWER':
      return {
        ...state,
        subject: {
          ...state.subject,
          hasSecretAnswer: action.hasSecretAnswer
        }
      };
    case 'SET_REWARD_FORM':
      return {
        ...state,
        ['reward' + contentKey]: action.form
          ? {
              ...(state['reward' + contentKey] || {}),
              ...action.form
            }
          : undefined
      };
    case 'SET_SEARCH_TEXT':
      return {
        ...state,
        [action.category + 'SearchText']: action.searchText
      };
    case 'SET_SECRET_ANSWER':
      return {
        ...state,
        subject: {
          ...state.subject,
          details: {
            ...state.subject.details,
            secretAnswer: action.secretAnswer
          }
        }
      };
    case 'SET_SUBJECT_ATTACHMENT':
      return {
        ...state,
        subject: {
          ...state.subject,
          attachment: action.attachment
        }
      };
    case 'SET_SUBJECT_DESCRIPTION':
      return {
        ...state,
        subject: {
          ...state.subject,
          details: {
            ...state.subject.details,
            description: action.description
          }
        }
      };
    case 'SET_SUBJECT_DESCRIPTION_FIELD_SHOWN':
      return {
        ...state,
        subject: {
          ...state.subject,
          descriptionFieldShown: action.shown
        }
      };
    case 'SET_SUBJECT_TITLE':
      return {
        ...state,
        subject: {
          ...state.subject,
          details: {
            ...state.subject.details,
            title: action.title
          }
        }
      };
    case 'SET_SUBJECT_REWARD_LEVEL':
      return {
        ...state,
        subject: {
          ...state.subject,
          details: {
            ...state.subject.details,
            rewardLevel: action.rewardLevel
          }
        }
      };
    case 'SET_USER_INFO_ON_EDIT':
      return {
        ...state,
        userInfo: action.onEdit
          ? {
              ...state.userInfo,
              userInfoOnEdit: true
            }
          : {}
      };
    case 'SET_WEBSITE_ERROR':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          websiteError: action.websiteError
        }
      };
    case 'SET_YOUTUBE_ERROR':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          youtubeError: action.youtubeError
        }
      };
    case 'RESET_CONTENT_INPUT':
      return {
        ...state,
        content: initialInputState.content
      };
    case 'RESET_SUBJECT_INPUT':
      return {
        ...state,
        subject: initialInputState.subject
      };
    default:
      return state;
  }
}
