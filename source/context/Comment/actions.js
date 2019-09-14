export default function CommentActions(dispatch) {
  return {
    onEnterComment({ contentId, text, contentType }) {
      return dispatch({
        type: 'ENTER_COMMENT',
        contentId,
        contentType,
        text
      });
    }
  };
}
