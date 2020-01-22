export default function InputActions(dispatch) {
  return {
    onEnterComment({ contentId, contentType, text }) {
      return dispatch({
        type: 'ENTER_COMMENT',
        contentId,
        contentType,
        text: contentType === 'vocabulary' ? text.toLowerCase() : text
      });
    },
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
    onSetEditedEmail(editedEmail) {
      return dispatch({
        type: 'SET_EDITED_EMAIL',
        editedEmail
      });
    },
    onSetEditedWebsite(editedWebsite) {
      return dispatch({
        type: 'SET_EDITED_WEBSITE',
        editedWebsite
      });
    },
    onSetEmailError(emailError) {
      return dispatch({
        type: 'SET_EMAIL_ERROR',
        emailError
      });
    },
    onSetEditedStatusColor(editedStatusColor) {
      return dispatch({
        type: 'SET_EDITED_STATUS_COLOR',
        editedStatusColor
      });
    },
    onSetEditedStatusMsg(editedStatusMsg) {
      return dispatch({
        type: 'SET_EDITED_STATUS_MSG',
        editedStatusMsg
      });
    },
    onSetEditedYoutubeName(editedYoutubeName) {
      return dispatch({
        type: 'SET_EDITED_YOUTUBE_NAME',
        editedYoutubeName
      });
    },
    onSetEditedYoutubeUrl(editedYoutubeUrl) {
      return dispatch({
        type: 'SET_EDITED_YOUTUBE_URL',
        editedYoutubeUrl
      });
    },
    onSetEditForm({ contentId, contentType, form }) {
      return dispatch({
        type: 'SET_EDIT_FORM',
        contentId,
        contentType,
        form
      });
    },
    onSetHasSecretAnswer(hasSecretAnswer) {
      return dispatch({
        type: 'SET_HAS_SECRET_ANSWER',
        hasSecretAnswer
      });
    },
    onSetRewardForm({ contentId, contentType, form }) {
      return dispatch({
        type: 'SET_REWARD_FORM',
        contentId,
        contentType,
        form
      });
    },
    onSetSubjectInputForm({ contentId, contentType, form }) {
      return dispatch({
        type: 'SET_SUBJECT_INPUT_FORM',
        contentId,
        contentType,
        form
      });
    },
    onSetSearchText({ category, searchText }) {
      return dispatch({
        type: 'SET_SEARCH_TEXT',
        category,
        searchText
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
    },
    onSetUserInfoOnEdit(onEdit) {
      return dispatch({
        type: 'SET_USER_INFO_ON_EDIT',
        onEdit
      });
    },
    onSetWebsiteError(websiteError) {
      return dispatch({
        type: 'SET_WEBSITE_ERROR',
        websiteError
      });
    },
    onSetYoutubeError(youtubeError) {
      return dispatch({
        type: 'SET_YOUTUBE_ERROR',
        youtubeError
      });
    }
  };
}
