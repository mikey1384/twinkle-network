import { initialHomeInputState } from '../initialStates';

export default function InputReducer(state, action) {
  switch (action.type) {
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
    case 'SET_HAS_SECRET_ANSWER':
      return {
        ...state,
        subject: {
          ...state.subject,
          hasSecretAnswer: action.hasSecretAnswer
        }
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
    case 'RESET_CONTENT_INPUT':
      return {
        ...state,
        content: initialHomeInputState.content
      };
    case 'RESET_SUBJECT_INPUT':
      return {
        ...state,
        subject: initialHomeInputState.subject
      };
    default:
      return state;
  }
}
