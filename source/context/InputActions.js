export default function InputActions(dispatch) {
  return {
    onResetContentInput() {
      return dispatch({
        type: 'RESET_CONTENT_INPUT'
      });
    },
    onResetSubjectInput() {
      return dispatch({
        type: 'RESET_SUBJECT_INPUT'
      });
    },
    onSetContentAlreadyPosted(alreadyPosted) {
      return dispatch({
        type: 'SET_CONTENT_ALREADY_POSTED',
        alreadyPosted
      });
    },
    onSetContentIsVideo(isVideo) {
      return dispatch({
        type: 'SET_CONTENT_IS_VIDEO',
        isVideo
      });
    },
    onSetContentDescription(description) {
      return dispatch({
        type: 'SET_CONTENT_DESCRIPTION',
        description
      });
    },
    onSetContentRewardLevel(rewardLevel) {
      return dispatch({
        type: 'SET_CONTENT_REWARD_LEVEL',
        rewardLevel
      });
    },
    onSetContentTitle(title) {
      return dispatch({
        type: 'SET_CONTENT_TITLE',
        title
      });
    },
    onSetContentDescriptionFieldShown(shown) {
      return dispatch({
        type: 'SET_CONTENT_DESCRIPTION_FIELD_SHOWN',
        shown
      });
    },
    onSetContentTitleFieldShown(shown) {
      return dispatch({
        type: 'SET_CONTENT_TITLE_FIELD_SHOWN',
        shown
      });
    },
    onSetContentUrl(url) {
      return dispatch({
        type: 'SET_CONTENT_URL',
        url
      });
    },
    onSetContentUrlError(urlError) {
      return dispatch({
        type: 'SET_CONTENT_URL_ERROR',
        urlError
      });
    },
    onSetContentUrlHelper(urlHelper) {
      return dispatch({
        type: 'SET_CONTENT_URL_HELPER',
        urlHelper
      });
    },
    onSetHasSecretAnswer(hasSecretAnswer) {
      return dispatch({
        type: 'SET_HAS_SECRET_ANSWER',
        hasSecretAnswer
      });
    },
    onSetSecretAnswer(secretAnswer) {
      return dispatch({
        type: 'SET_SECRET_ANSWER',
        secretAnswer
      });
    },
    onSetSubjectAttachment(attachment) {
      return dispatch({
        type: 'SET_SUBJECT_ATTACHMENT',
        attachment
      });
    },
    onSetSubjectDescription(description) {
      return dispatch({
        type: 'SET_SUBJECT_DESCRIPTION',
        description
      });
    },
    onSetSubjectDescriptionFieldShown(shown) {
      return dispatch({
        type: 'SET_SUBJECT_DESCRIPTION_FIELD_SHOWN',
        shown
      });
    },
    onSetSubjectRewardLevel(rewardLevel) {
      return dispatch({
        type: 'SET_SUBJECT_REWARD_LEVEL',
        rewardLevel
      });
    },
    onSetSubjectTitle(title) {
      return dispatch({
        type: 'SET_SUBJECT_TITLE',
        title
      });
    }
  };
}
