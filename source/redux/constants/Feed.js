const types = {
  ADD_TAG_TO_CONTENTS: 'ADD_TAG_TO_CONTENTS',
  ADD_TAGS: 'ADD_TAGS',
  ATTACH_STAR: 'ATTACH_STAR',
  CHANGE_BY_USER_STATUS: 'CHANGE_BY_USER_STATUS',
  CLEAR: 'CLEAR',
  DELETE_COMMENT: 'DELETE_COMMENT',
  DELETE_CONTENT: 'DELETE_CONTENT',
  EDIT_COMMENT: 'EDIT_COMMENT',
  EDIT_CONTENT: 'EDIT_CONTENT',
  EDIT_DISCUSSION: 'EDIT_DISCUSSION',
  EDIT_QUESTION: 'EDIT_QUESTION',
  EDIT_REWARD_COMMENT: 'EDIT_REWARD_COMMENT',
  LIKE_CONTENT: 'LIKE_CONTENT',
  LOAD: 'LOAD',
  LOAD_COMMENTS: 'LOAD_COMMENTS',
  LOAD_DETAIL: 'LOAD_DETAIL',
  LOAD_MORE: 'LOAD_MORE',
  LOAD_MORE_COMMENTS: 'LOAD_MORE_COMMENTS',
  LOAD_MORE_REPLIES: 'LOAD_MORE_REPLIES',
  LOAD_NEW: 'LOAD_NEW',
  LOAD_REPLIES_OF_REPLY: 'LOAD_REPLIES_OF_REPLY',
  LOAD_TAGS: 'LOAD_TAGS',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  SET_SECTION: 'SET_SECTION',
  STAR_VIDEO: 'STAR_VIDEO',
  UPLOAD_COMMENT: 'UPLOAD_COMMENT',
  UPLOAD_CONTENT: 'UPLOAD_CONTENT',
  UPLOAD_TC_COMMENT: 'UPLOAD_TC_COMMENT'
};

for (let key in types) {
  types[key] = `${types[key]}_FEED`;
}

export default types;
