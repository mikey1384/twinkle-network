import { initialHomeInputState } from './initialStates';

export default function InputReducer(state, action) {
  switch (action.type) {
    case 'ENTER_SECRET_ANSWER':
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
    case 'ENTER_SUBJECT_DESCRIPTION':
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
    case 'ENTER_SUBJECT_TITLE':
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
    case 'SET_SUBJECT_DESCRIPTION_INPUT_SHOWN':
      return {
        ...state,
        subject: {
          ...state.subject,
          descriptionInputShown: action.shown
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
    case 'SET_SUBJECT_ATTACHMENT':
      return {
        ...state,
        subject: {
          ...state.subject,
          attachment: action.attachment
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
    case 'SUBJECT_INPUT_RESET':
      return initialHomeInputState;
    default:
      return state;
  }
}
