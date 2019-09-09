export default function CommentActions(dispatch) {
  return {
    onEnterComment({ contentId, text }) {
      return dispatch({
        type: 'ENTER_COMMENT',
        contentId,
        text
      });
    }
  };
}
