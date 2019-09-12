import React from 'react';
import PropTypes from 'prop-types';
import SubjectPanel from './SubjectPanel';
import SubjectInputArea from './SubjectInputArea';
import Button from 'components/Button';
import Context from './Context';
import { loadSubjects } from 'helpers/requestHelpers';

Subjects.propTypes = {
  className: PropTypes.string,
  contentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  subjects: PropTypes.array,
  loadMoreButton: PropTypes.bool,
  onLoadMoreSubjects: PropTypes.func.isRequired,
  onSubjectEditDone: PropTypes.func.isRequired,
  onSubjectDelete: PropTypes.func.isRequired,
  onLoadSubjectComments: PropTypes.func.isRequired,
  rootRewardLevel: PropTypes.number,
  setSubjectRewardLevel: PropTypes.func.isRequired,
  style: PropTypes.object,
  contentType: PropTypes.string,
  uploadSubject: PropTypes.func.isRequired,
  commentActions: PropTypes.shape({
    attachStar: PropTypes.func.isRequired,
    editRewardComment: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreComments: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onUploadComment: PropTypes.func.isRequired,
    onUploadReply: PropTypes.func.isRequired
  })
};

export default function Subjects({
  className,
  subjects,
  loadMoreButton,
  style = {},
  contentId,
  contentType,
  uploadSubject,
  onLoadMoreSubjects,
  onLoadSubjectComments,
  onSubjectEditDone,
  onSubjectDelete,
  rootRewardLevel,
  setSubjectRewardLevel,
  commentActions: {
    attachStar,
    editRewardComment,
    onDelete,
    onEditDone,
    onLikeClick,
    onLoadMoreComments,
    onLoadMoreReplies,
    onUploadComment,
    onUploadReply
  }
}) {
  return (
    <Context.Provider
      value={{
        attachStar,
        editRewardComment,
        onDelete,
        onEditDone,
        onLikeClick,
        onLoadMoreComments,
        onLoadMoreReplies,
        onSubjectEditDone,
        onSubjectDelete,
        onLoadSubjectComments,
        setSubjectRewardLevel,
        onUploadComment,
        onUploadReply
      }}
    >
      <div className={className} style={style}>
        <SubjectInputArea
          contentId={contentId}
          contentType={contentType}
          onUploadSubject={uploadSubject}
        />
        <div style={{ margin: '1rem 0' }}>
          {subjects &&
            subjects.map(subject => (
              <SubjectPanel
                key={subject.id}
                contentId={Number(contentId)}
                rootRewardLevel={rootRewardLevel}
                contentType={contentType}
                {...subject}
              />
            ))}
          {loadMoreButton && (
            <Button
              style={{ width: '100%', borderRadius: 0 }}
              filled
              color="lightBlue"
              onClick={loadMoreSubjects}
            >
              Load More Subjects
            </Button>
          )}
        </div>
      </div>
    </Context.Provider>
  );

  async function loadMoreSubjects() {
    const data = await loadSubjects({
      contentType,
      contentId,
      lastSubjectId: subjects[subjects.length - 1].id
    });
    onLoadMoreSubjects({ ...data, contentId, contentType });
  }
}
