export default function ContentActions(dispatch) {
  return {
    onAddTags({ tags, contentType, contentId }) {
      return dispatch({
        type: 'ADD_TAGS',
        tags,
        contentType,
        contentId: Number(contentId)
      });
    },
    onAddTagToContents({ contentIds, contentType, tagId, tagTitle }) {
      return dispatch({
        type: 'ADD_TAG_TO_CONTENTS',
        contentIds,
        contentType,
        tagId,
        tagTitle
      });
    },
    onAttachStar({ data, contentId, contentType }) {
      return dispatch({
        type: 'ATTACH_STAR',
        data,
        contentId,
        contentType
      });
    },
    onChangeProfileTheme({ userId, theme }) {
      return dispatch({
        type: 'CHANGE_PROFILE_THEME',
        contentId: userId,
        contentType: 'user',
        theme
      });
    },
    onChangeSpoilerStatus({ checked, shown, subjectId }) {
      return dispatch({
        type: 'CHANGE_SPOILER_STATUS',
        shown,
        checked,
        contentId: subjectId,
        contentType: 'subject'
      });
    },
    onChangeUserXP({ xp, rank, userId }) {
      return dispatch({
        type: 'CHANGE_USER_XP',
        contentId: userId,
        contentType: 'user',
        xp,
        rank
      });
    },
    onDeleteComment(commentId) {
      return dispatch({
        type: 'DELETE_COMMENT',
        commentId
      });
    },
    onDeleteContent({ contentType, contentId }) {
      return dispatch({
        type: 'DELETE_CONTENT',
        contentType,
        contentId
      });
    },
    onEditComment({ commentId, editedComment }) {
      return dispatch({
        type: 'EDIT_COMMENT',
        commentId,
        editedComment
      });
    },
    onEditContent({ data, contentType, contentId }) {
      return dispatch({
        type: 'EDIT_CONTENT',
        contentType,
        contentId,
        data
      });
    },
    onEditRewardComment({ id, text }) {
      return dispatch({
        type: 'EDIT_REWARD_COMMENT',
        id,
        text
      });
    },
    onEditSubject({ editedSubject, subjectId }) {
      return dispatch({
        type: 'EDIT_SUBJECT',
        editedSubject,
        subjectId
      });
    },
    onInitContent({ contentId, contentType, ...data }) {
      return dispatch({
        type: 'INIT_CONTENT',
        contentId: Number(contentId),
        contentType,
        data
      });
    },
    onLikeComment({ commentId, likes }) {
      return dispatch({
        type: 'LIKE_COMMENT',
        commentId,
        likes
      });
    },
    onLikeContent({ likes, contentType, contentId }) {
      return dispatch({
        type: 'LIKE_CONTENT',
        likes,
        contentType,
        contentId: Number(contentId)
      });
    },
    onLoadComments({
      comments,
      contentId,
      contentType,
      isPreview,
      loadMoreButton
    }) {
      return dispatch({
        type: 'LOAD_COMMENTS',
        comments,
        contentId,
        contentType,
        isPreview,
        loadMoreButton
      });
    },
    onLoadMoreComments({ comments, loadMoreButton, contentId, contentType }) {
      return dispatch({
        type: 'LOAD_MORE_COMMENTS',
        comments,
        loadMoreButton,
        contentId,
        contentType
      });
    },
    onLoadMoreReplies({
      commentId,
      replies,
      loadMoreButton,
      contentType,
      contentId
    }) {
      return dispatch({
        type: 'LOAD_MORE_REPLIES',
        commentId,
        replies,
        loadMoreButton,
        contentType,
        contentId
      });
    },
    onLoadMoreSubjectComments({
      comments,
      loadMoreButton,
      contentId,
      contentType,
      subjectId
    }) {
      return dispatch({
        type: 'LOAD_MORE_SUBJECT_COMMENTS',
        comments,
        loadMoreButton,
        subjectId,
        contentId,
        contentType
      });
    },
    onLoadMoreSubjectReplies({
      commentId,
      loadMoreButton,
      replies,
      contentId,
      contentType
    }) {
      return dispatch({
        type: 'LOAD_MORE_SUBJECT_REPLIES',
        commentId,
        loadMoreButton,
        replies,
        contentId,
        contentType
      });
    },
    onLoadMoreSubjects({ results, loadMoreButton, contentId, contentType }) {
      return dispatch({
        type: 'LOAD_MORE_SUBJECTS',
        results,
        loadMoreButton,
        contentId,
        contentType
      });
    },
    onLoadRepliesOfReply({
      replies,
      commentId,
      replyId,
      contentType,
      contentId
    }) {
      return dispatch({
        type: 'LOAD_REPLIES_OF_REPLY',
        replies,
        commentId,
        replyId,
        contentType,
        contentId
      });
    },
    onLoadSubjects({ contentId, contentType, subjects, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_SUBJECTS',
        contentId,
        contentType,
        subjects,
        loadMoreButton
      });
    },
    onLoadSubjectComments({
      comments,
      loadMoreButton,
      subjectId,
      contentType,
      contentId
    }) {
      return dispatch({
        type: 'LOAD_SUBJECT_COMMENTS',
        comments,
        loadMoreButton,
        subjectId,
        contentType,
        contentId
      });
    },
    onLoadTags({ contentType, contentId, tags }) {
      return dispatch({
        type: 'LOAD_TAGS',
        contentId,
        contentType,
        tags
      });
    },
    onReloadContent({ contentId, contentType }) {
      return dispatch({
        type: 'RELOAD_CONTENT',
        contentId,
        contentType
      });
    },
    onReloadComments({ contentId, contentType }) {
      return dispatch({
        type: 'RELOAD_COMMENTS',
        contentId,
        contentType
      });
    },
    onRemoveStatusMsg(userId) {
      return dispatch({
        type: 'DELETE_STATUS_MSG',
        contentId: userId,
        contentType: 'user'
      });
    },
    onSetActualDescription({ contentId, contentType, description }) {
      return dispatch({
        type: 'SET_ACTUAL_URL_DESCRIPTION',
        contentId,
        contentType,
        description
      });
    },
    onSetActualTitle({ contentId, contentType, title }) {
      return dispatch({
        type: 'SET_ACTUAL_URL_TITLE',
        contentId,
        contentType,
        title
      });
    },
    onSetByUserStatus({ byUser, contentId, contentType }) {
      return dispatch({
        type: 'SET_BY_USER_STATUS',
        byUser,
        contentId,
        contentType
      });
    },
    onSetChatInvitationDetail({ messageId, detail }) {
      return dispatch({
        type: 'SET_CHAT_INVITATION_DETAIL',
        contentId: messageId,
        contentType: 'chat',
        detail
      });
    },
    onSetCommentsShown({ contentId, contentType }) {
      return dispatch({
        type: 'SET_COMMENTS_SHOWN',
        contentId,
        contentType
      });
    },
    onSetEmbeddedUrl({ contentId, contentType, url }) {
      return dispatch({
        type: 'SET_EMBEDDED_URL',
        contentId,
        contentType,
        url
      });
    },
    onSetExistingContent({ contentId, contentType, content }) {
      return dispatch({
        type: 'SET_EXISTING_CONTENT',
        contentId,
        contentType,
        content
      });
    },
    onSetIsEditing({ contentId, contentType, isEditing }) {
      return dispatch({
        type: 'SET_IS_EDITING',
        contentId,
        contentType,
        isEditing
      });
    },
    onSetOnline({ contentId, contentType, online }) {
      return dispatch({
        type: 'SET_USER_ONLINE',
        contentId,
        contentType,
        online
      });
    },
    onSetPlaceholderHeight({ contentId, contentType, height }) {
      return dispatch({
        type: 'SET_PLACEHOLDER_HEIGHT',
        contentId,
        contentType,
        height
      });
    },
    onSetPrevUrl({ contentId, contentType, prevUrl }) {
      return dispatch({
        type: 'SET_PREV_URL',
        contentId,
        contentType,
        prevUrl
      });
    },
    onSetRewardLevel({ rewardLevel, contentType, contentId }) {
      return dispatch({
        type: 'SET_REWARD_LEVEL',
        rewardLevel,
        contentType,
        contentId
      });
    },
    onSetSiteUrl({ contentId, contentType, siteUrl }) {
      return dispatch({
        type: 'SET_SITE_URL',
        contentId,
        contentType,
        siteUrl
      });
    },
    onSetSubjectFormShown({ contentId, contentType, shown }) {
      return dispatch({
        type: 'SET_SUBJECT_FORM_SHOWN',
        contentId,
        contentType,
        shown
      });
    },
    onSetSubjectRewardLevel({ contentId, contentType, rewardLevel }) {
      return dispatch({
        type: 'SET_SUBJECT_REWARD_LEVEL',
        rewardLevel,
        contentId: Number(contentId),
        contentType
      });
    },
    onSetThumbUrl({ contentId, contentType, thumbUrl }) {
      return dispatch({
        type: 'SET_THUMB_URL',
        contentId,
        contentType,
        thumbUrl
      });
    },
    onSetVideoCurrentTime({ videoId, currentTime }) {
      return dispatch({
        type: 'SET_VIDEO_CURRENT_TIME',
        contentType: 'video',
        contentId: videoId,
        currentTime
      });
    },
    onSetVideoImageUrl({ videoId, url }) {
      return dispatch({
        type: 'SET_VIDEO_IMAGE_URL',
        contentType: 'video',
        contentId: videoId,
        url
      });
    },
    onSetVideoQuestions({ questions, contentType, contentId }) {
      return dispatch({
        type: 'SET_VIDEO_QUESTIONS',
        questions,
        contentType,
        contentId
      });
    },
    onSetVideoXpEarned({ videoId, earned }) {
      return dispatch({
        type: 'SET_VIDEO_XP_EARNED',
        contentType: 'video',
        contentId: videoId,
        earned
      });
    },
    onSetVideoXpJustEarned({ videoId, justEarned }) {
      return dispatch({
        type: 'SET_VIDEO_XP_JUST_EARNED',
        contentType: 'video',
        contentId: videoId,
        justEarned
      });
    },
    onSetVideoStarted({ videoId, started }) {
      return dispatch({
        type: 'SET_VIDEO_STARTED',
        contentType: 'video',
        contentId: videoId,
        started
      });
    },
    onSetVideoXpLoaded({ videoId, loaded }) {
      return dispatch({
        type: 'SET_VIDEO_XP_LOADED',
        contentType: 'video',
        contentId: videoId,
        loaded
      });
    },
    onSetVideoXpProgress({ videoId, progress }) {
      return dispatch({
        type: 'SET_VIDEO_XP_PROGRESS',
        contentType: 'video',
        contentId: videoId,
        progress
      });
    },
    onSetVisible({ visible, contentId, contentType }) {
      return dispatch({
        type: 'SET_VISIBLE',
        contentType,
        contentId,
        visible
      });
    },
    onSetXpRewardInterfaceShown({ contentId, contentType, shown }) {
      return dispatch({
        type: 'SET_XP_REWARD_INTERFACE_SHOWN',
        contentId,
        contentType,
        shown
      });
    },
    onSetXpVideoWatchTime({ videoId, watchTime }) {
      return dispatch({
        type: 'SET_XP_VIDEO_WATCH_TIME',
        contentType: 'video',
        contentId: videoId,
        watchTime
      });
    },
    onShowTCReplyInput({ contentId, contentType }) {
      return dispatch({
        type: 'SHOW_TC_REPLY_INPUT',
        contentId,
        contentType
      });
    },
    onUpdateBio({ bio, userId }) {
      return dispatch({
        type: 'UPDATE_USER_BIO',
        contentType: 'user',
        contentId: userId,
        bio
      });
    },
    onUpdateGreeting({ greeting, userId }) {
      return dispatch({
        type: 'UPDATE_USER_GREETING',
        contentId: userId,
        contentType: 'user',
        greeting
      });
    },
    onUpdateProfileInfo({ userId, ...data }) {
      return dispatch({
        type: 'UPDATE_PROFILE_INFO',
        data,
        contentId: userId,
        contentType: 'user'
      });
    },
    onUpdateStatusMsg({ statusColor, statusMsg, userId }) {
      return dispatch({
        type: 'UPDATE_STATUS_MSG',
        statusColor,
        statusMsg,
        contentType: 'user',
        contentId: userId
      });
    },
    onUploadComment({ contentId, contentType, ...data }) {
      return dispatch({
        type: 'UPLOAD_COMMENT',
        data,
        contentId,
        contentType
      });
    },
    onUploadProfilePic({ userId, imageId }) {
      return dispatch({
        type: 'EDIT_PROFILE_PICTURE',
        contentId: userId,
        contentType: 'user',
        imageId
      });
    },
    onUploadReply({ contentId, contentType, ...data }) {
      return dispatch({
        type: 'UPLOAD_REPLY',
        data,
        contentId,
        contentType
      });
    },
    onUploadSubject({ contentType, contentId, ...subject }) {
      return dispatch({
        type: 'UPLOAD_SUBJECT',
        subject,
        contentId,
        contentType
      });
    },
    onUploadTargetComment({ contentType, contentId, ...data }) {
      return dispatch({
        type: 'UPLOAD_TARGET_COMMENT',
        data,
        contentType,
        contentId
      });
    }
  };
}
