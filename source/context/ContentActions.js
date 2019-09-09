export default function ContentActions(dispatch) {
  return {
    onAddTags({ tags }) {
      return dispatch({
        type: 'ADD_TAGS',
        tags
      });
    },
    onAttachStar(data) {
      return dispatch({
        type: 'ATTACH_STAR',
        data
      });
    },
    onChangeSpoilerStatus(shown) {
      return dispatch({
        type: 'CHANGE_SPOILER_STATUS',
        shown
      });
    },
    onDeleteComment(commentId) {
      return dispatch({
        type: 'DELETE_COMMENT',
        commentId
      });
    },
    onDeleteSubject(subjectId) {
      return dispatch({
        type: 'DELETE_SUBJECT',
        subjectId
      });
    },
    onEditComment({ commentId, editedComment }) {
      return dispatch({
        type: 'EDIT_COMMENT',
        commentId,
        editedComment
      });
    },
    onEditContent({ data }) {
      return dispatch({
        type: 'EDIT_CONTENT',
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
    onInitContent({ content }) {
      return dispatch({
        type: 'INIT_CONTENT',
        content
      });
    },
    onLikeComment({ commentId, likes }) {
      return dispatch({
        type: 'LIKE_COMMENT',
        commentId,
        likes
      });
    },
    onLikeContent({ likes, type, contentId }) {
      return dispatch({
        type: 'LIKE_CONTENT',
        likes,
        contentType: type,
        contentId: Number(contentId)
      });
    },
    onLoadComments({ comments, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_COMMENTS',
        comments,
        loadMoreButton
      });
    },
    onLoadMoreComments(data) {
      return dispatch({
        type: 'LOAD_MORE_COMMENTS',
        data
      });
    },
    onLoadMoreReplies({ commentId, replies, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_MORE_REPLIES',
        commentId,
        replies,
        loadMoreButton
      });
    },
    onLoadMoreSubjectComments({
      data: { comments, loadMoreButton },
      subjectId
    }) {
      return dispatch({
        type: 'LOAD_MORE_SUBJECT_COMMENTS',
        comments,
        loadMoreButton,
        subjectId
      });
    },
    onLoadMoreSubjectReplies({ commentId, loadMoreButton, replies }) {
      return dispatch({
        type: 'LOAD_MORE_SUBJECT_REPLIES',
        commentId,
        loadMoreButton,
        replies
      });
    },
    onLoadMoreSubjects({ results, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_MORE_SUBJECTS',
        results,
        loadMoreButton
      });
    },
    onLoadRepliesOfReply({ replies, commentId, replyId }) {
      return dispatch({
        type: 'LOAD_REPLIES_OF_REPLY',
        replies,
        commentId,
        replyId
      });
    },
    onLoadSubjectComments({ data: { comments, loadMoreButton }, subjectId }) {
      return dispatch({
        type: 'LOAD_SUBJECT_COMMENTS',
        comments,
        loadMoreButton,
        subjectId
      });
    },
    onSetByUserStatus(byUser) {
      return dispatch({
        type: 'SET_BY_USER_STATUS',
        byUser
      });
    },
    onSetCommentsShown() {
      return dispatch({
        type: 'SET_COMMENTS_SHOWN'
      });
    },
    onSetRewardLevel({ rewardLevel }) {
      return dispatch({
        type: 'SET_REWARD_LEVEL',
        rewardLevel
      });
    },
    onSetSubjectRewardLevel({ contentId, rewardLevel }) {
      return dispatch({
        type: 'SET_SUBJECT_REWARD_LEVEL',
        contentId: Number(contentId),
        rewardLevel
      });
    },
    onSetVideoQuestions(questions) {
      return dispatch({
        type: 'SET_VIDEO_QUESTIONS',
        questions
      });
    },
    onShowTCReplyInput() {
      return dispatch({
        type: 'SHOW_TC_REPLY_INPUT'
      });
    },
    onTargetCommentSubmit(data) {
      return dispatch({
        type: 'UPLOAD_TARGET_COMMENT',
        data
      });
    },
    onUploadComment(data) {
      return dispatch({
        type: 'UPLOAD_COMMENT',
        data
      });
    },
    onUploadReply(data) {
      return dispatch({
        type: 'UPLOAD_REPLY',
        data
      });
    },
    onUploadSubject(subject) {
      return dispatch({
        type: 'UPLOAD_SUBJECT',
        subject
      });
    }
  };
}
