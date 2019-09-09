export default function CommentActions(dispatch) {
  return {
    onEnterComment({ contentId, text, type }) {
      return dispatch({
        type: 'ENTER_COMMENT',
        contentId,
        contentType: type,
        text
      });
    }
  };
}
