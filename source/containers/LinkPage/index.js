import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'components/Button';
import Loading from 'components/Loading';
import Embedly from 'components/Embedly';
import { editLinkPage, likeLink } from 'redux/actions/LinkActions';
import Comments from 'components/Comments';
import Subjects from 'components/Subjects';
import LikeButton from 'components/Buttons/LikeButton';
import Likers from 'components/Likers';
import ConfirmModal from 'components/Modals/ConfirmModal';
import UserListModal from 'components/Modals/UserListModal';
import Description from './Description';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import Icon from 'components/Icon';
import request from 'axios';
import NotFound from 'components/NotFound';
import { URL } from 'constants/URL';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import { determineXpButtonDisabled } from 'helpers';
import { processedURL } from 'helpers/stringHelpers';
import {
  auth,
  handleError,
  loadComments,
  loadSubjects
} from 'helpers/requestHelpers';

class LinkPage extends Component {
  static propTypes = {
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    canStar: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    editLinkPage: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    likeLink: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myId: PropTypes.number
  };

  state = {
    notFound: false,
    confirmModalShown: false,
    likesModalShown: false,
    xpRewardInterfaceShown: false,
    contentObj: {
      id: undefined,
      title: undefined,
      content: undefined,
      description: undefined,
      subjects: [],
      subjectLoadMoreButton: false,
      timeStamp: undefined,
      uploader: undefined,
      uploaderAuthLevel: undefined,
      uploaderName: undefined,
      comments: [],
      likes: [],
      loadMoreCommentsButton: false,
      stars: []
    }
  };

  async componentDidMount() {
    const {
      match: {
        params: { linkId }
      }
    } = this.props;
    try {
      await this.loadLinkPage(linkId);
      const subjectsObj = await loadSubjects({
        type: 'url',
        contentId: linkId
      });
      this.fetchSubjects(subjectsObj);
      const commentsObj = await loadComments({
        id: linkId,
        type: 'url',
        limit: 5
      });
      if (commentsObj) this.fetchComments(commentsObj);
    } catch (error) {
      if (error.response) {
        const { data = {} } = error.response;
        if (data.notFound) {
          this.setState({ notFound: true });
        }
      }
      console.error(error.response || error);
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      location,
      match: {
        params: { linkId }
      }
    } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      try {
        await this.loadLinkPage(linkId);
        const commentsObj = await loadComments({
          id: linkId,
          type: 'url'
        });
        if (commentsObj) this.fetchComments(commentsObj);
      } catch (error) {
        if (error.response) {
          const { data = {} } = error.response;
          if (data.notFound) {
            this.setState({ notFound: true });
          }
        }
        console.error(error.response || error);
      }
    }
  }

  render() {
    const {
      authLevel,
      canDelete,
      canEdit,
      canStar,
      dispatch,
      history,
      myId
    } = this.props;
    const {
      confirmModalShown,
      likesModalShown,
      notFound,
      xpRewardInterfaceShown,
      contentObj: {
        comments,
        content,
        description,
        subjects,
        subjectLoadMoreButton,
        id,
        likes,
        loadMoreCommentsButton,
        stars,
        timeStamp,
        title,
        uploader,
        uploaderName,
        uploaderAuthLevel,
        ...embedlyProps
      }
    } = this.state;
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].id === myId) userLikedThis = true;
    }
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel;
    const userIsUploader = uploader === myId;

    return id ? (
      <div
        className={css`
          margin-top: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 0;
          }
        `}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          fontSize: '1.7rem',
          paddingBottom: '10rem'
        }}
      >
        <div
          className={css`
            width: 60%;
            background-color: #fff;
            padding-bottom: 1rem;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        >
          <Description
            key={'description' + id}
            content={content}
            uploaderAuthLevel={uploaderAuthLevel}
            uploaderId={uploader}
            uploaderName={uploaderName}
            timeStamp={timeStamp}
            myId={myId}
            title={title}
            url={content}
            userCanEditThis={userCanEditThis}
            description={description}
            linkId={id}
            onDelete={() => this.setState({ confirmModalShown: true })}
            onEditDone={this.editLinkPage}
            userIsUploader={userIsUploader}
          />
          <Embedly
            key={'link' + id}
            title={title}
            style={{ marginTop: '2rem' }}
            id={id}
            url={content}
            {...embedlyProps}
          />
          <RewardStatus
            contentType="url"
            onCommentEdit={this.editRewardComment}
            style={{
              fontSize: '1.4rem'
            }}
            stars={stars}
            uploaderName={uploaderName}
          />
          <div
            style={{
              paddingTop: '1.5rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex' }}>
              <LikeButton
                key={'like' + id}
                filled
                style={{ fontSize: '2rem' }}
                contentType="url"
                contentId={id}
                onClick={this.likeLink}
                liked={userLikedThis}
              />
              {canStar && userCanEditThis && !userIsUploader && (
                <Button
                  love
                  filled
                  disabled={determineXpButtonDisabled({
                    myId,
                    xpRewardInterfaceShown,
                    stars
                  })}
                  style={{
                    fontSize: '2rem',
                    marginLeft: '1rem'
                  }}
                  onClick={() =>
                    this.setState({ xpRewardInterfaceShown: true })
                  }
                >
                  <Icon icon="certificate" />
                  <span style={{ marginLeft: '0.7rem' }}>
                    {determineXpButtonDisabled({
                      myId,
                      xpRewardInterfaceShown,
                      stars
                    }) || 'Reward'}
                  </span>
                </Button>
              )}
            </div>
            <Likers
              key={'likes' + id}
              style={{ marginTop: '0.5rem', fontSize: '1.3rem' }}
              likes={likes}
              userId={myId}
              onLinkClick={() => this.setState({ likesModalShown: true })}
            />
          </div>
          {xpRewardInterfaceShown && (
            <div style={{ padding: '0 1rem' }}>
              <XPRewardInterface
                stars={stars}
                contentType="url"
                contentId={Number(id)}
                noPadding
                uploaderId={uploader}
                onRewardSubmit={data => {
                  this.setState({ xpRewardInterfaceShown: false });
                  this.attachStar(data);
                }}
              />
            </div>
          )}
        </div>
        <Subjects
          className={css`
            width: 60%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
          contentId={id}
          loadMoreButton={subjectLoadMoreButton}
          subjects={subjects}
          onLoadMoreSubjects={this.fetchMoreSubjects}
          onLoadSubjectComments={this.fetchSubjectResponses}
          onSubjectEditDone={this.editSubject}
          onSubjectDelete={this.deleteSubject}
          setSubjectDifficulty={this.setSubjectDifficulty}
          uploadSubject={this.uploadSubject}
          type="url"
          commentActions={{
            attachStar: this.attachStar,
            editRewardComment: this.editRewardComment,
            onDelete: this.deleteComment,
            onEditDone: this.editComment,
            onLikeClick: this.likeComment,
            onLoadMoreComments: this.fetchMoreSubjectComments,
            onLoadMoreReplies: this.fetchMoreSubjectReplies,
            onUploadComment: this.uploadComment,
            onUploadReply: this.uploadReply
          }}
        />
        <Comments
          autoExpand
          comments={comments}
          inputTypeLabel="comment"
          key={'comments' + id}
          loadMoreButton={loadMoreCommentsButton}
          loadMoreComments={this.fetchMoreComments}
          onAttachStar={this.attachStar}
          onCommentSubmit={this.uploadComment}
          onDelete={this.deleteComment}
          onEditDone={this.editComment}
          onLikeClick={this.likeComment}
          onLoadMoreReplies={this.fetchMoreReplies}
          onReplySubmit={this.uploadReply}
          onRewardCommentEdit={this.editRewardComment}
          parent={{ type: 'url', id }}
          className={css`
            padding: 1rem;
            width: 60%;
            background: #fff;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
          userId={myId}
        />
        {confirmModalShown && (
          <ConfirmModal
            key={'confirm' + id}
            title="Remove Link"
            onConfirm={async() => {
              try {
                await request.delete(`${URL}/url?linkId=${id}`, auth());
                history.push('/links');
              } catch (error) {
                handleError(error, dispatch);
              }
            }}
            onHide={() => this.setState({ confirmModalShown: false })}
          />
        )}
        {likesModalShown && (
          <UserListModal
            key={'userlist' + id}
            users={likes}
            userId={myId}
            title="People who liked this"
            description="(You)"
            onHide={() => this.setState({ likesModalShown: false })}
          />
        )}
      </div>
    ) : notFound ? (
      <NotFound />
    ) : (
      <Loading text="Loading Page..." />
    );
  }

  attachStar = data => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        stars:
          data.contentType === 'url'
            ? state.contentObj.stars?.concat(data)
            : state.contentObj.stars || [],
        comments: state.contentObj.comments.map(comment => ({
          ...comment,
          stars:
            comment.id === data.contentId
              ? comment.stars?.concat(data)
              : comment.stars || [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars:
              reply.id === data.contentId
                ? reply.stars?.concat(data)
                : reply.stars || []
          }))
        })),
        subjects: state.contentObj.subjects.map(subject => ({
          ...subject,
          comments: subject.comments.map(comment => ({
            ...comment,
            stars:
              comment.id === data.contentId
                ? comment.stars?.concat(data)
                : comment.stars || [],
            replies: comment.replies.map(reply => ({
              ...reply,
              stars:
                reply.id === data.contentId
                  ? reply.stars?.concat(data)
                  : reply.stars || []
            }))
          }))
        }))
      }
    }));
  };

  deleteComment = commentId => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: state.contentObj.comments.reduce((prev, comment) => {
          if (comment.id === commentId) return prev;
          return prev.concat([
            {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            }
          ]);
        }, []),
        subjects: state.contentObj.subjects.map(subject => {
          return {
            ...subject,
            comments: subject.comments
              ?.filter(comment => comment.id !== commentId)
              .map(comment => ({
                ...comment,
                replies: comment.replies?.filter(
                  reply => reply.id !== commentId
                )
              }))
          };
        })
      }
    }));
  };

  deleteSubject = subjectId => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        subjects: state.contentObj.subjects.filter(
          subject => subject.id !== subjectId
        )
      }
    }));
  };

  editComment = ({ commentId, editedComment }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: state.contentObj.comments.map(comment => ({
          ...comment,
          content: comment.id === commentId ? editedComment : comment.content,
          replies: comment.replies.map(reply => ({
            ...reply,
            content: reply.id === commentId ? editedComment : reply.content
          }))
        })),
        subjects: state.contentObj.subjects.map(subject => ({
          ...subject,
          comments: subject.comments.map(comment => ({
            ...comment,
            content: comment.id === commentId ? editedComment : comment.content,
            replies: comment.replies.map(reply => ({
              ...reply,
              content: reply.id === commentId ? editedComment : reply.content
            }))
          }))
        }))
      }
    }));
  };

  editSubject = ({ editedSubject, subjectId }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        subjects: state.contentObj.subjects.map(subject => ({
          ...subject,
          title:
            subject.id === subjectId
              ? editedSubject.title
              : subject.title,
          description:
            subject.id === subjectId
              ? editedSubject.description
              : subject.description
        }))
      }
    }));
  };

  editLinkPage = async params => {
    const { dispatch, editLinkPage } = this.props;
    try {
      await request.put(`${URL}/url/page`, params, auth());
      const {
        linkId: id,
        editedTitle: title,
        editedDescription: description,
        editedUrl: content
      } = params;
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          content: processedURL(content),
          title,
          description
        }
      }));
      editLinkPage({ id: Number(id), title, content: processedURL(content) });
    } catch (error) {
      handleError(error, dispatch);
    }
  };

  editRewardComment = ({ id, text }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        stars: (state.contentObj.stars || []).map(star => ({
          ...star,
          rewardComment: star.id === id ? text : star.rewardComment
        })),
        comments: state.contentObj.comments.map(comment => ({
          ...comment,
          stars: comment.stars
            ? comment.stars.map(star => ({
                ...star,
                rewardComment: star.id === id ? text : star.rewardComment
              }))
            : [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars: reply.stars
              ? reply.stars.map(star => ({
                  ...star,
                  rewardComment: star.id === id ? text : star.rewardComment
                }))
              : []
          }))
        })),
        subjects: state.contentObj.subjects.map(subject => ({
          ...subject,
          comments: subject.comments.map(comment => ({
            ...comment,
            stars: comment.stars
              ? comment.stars.map(star => ({
                  ...star,
                  rewardComment: star.id === id ? text : star.rewardComment
                }))
              : [],
            replies: comment.replies.map(reply => ({
              ...reply,
              stars: reply.stars
                ? reply.stars.map(star => ({
                    ...star,
                    rewardComment: star.id === id ? text : star.rewardComment
                  }))
                : []
            }))
          }))
        }))
      }
    }));
  };

  fetchComments = ({ comments, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: comments,
        loadMoreCommentsButton: loadMoreButton
      }
    }));
  };

  fetchMoreComments = ({ comments, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: state.contentObj.comments.concat(comments),
        loadMoreCommentsButton: loadMoreButton
      }
    }));
  };

  fetchSubjects = ({ results, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        subjects: results,
        subjectLoadMoreButton: loadMoreButton
      }
    }));
  };

  fetchSubjectResponses = ({
    data: { comments, loadMoreButton },
    subjectId
  }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        subjects: state.contentObj.subjects.map(subject => {
          if (subject.id === subjectId) {
            return {
              ...subject,
              comments: comments,
              loadMoreCommentsButton: loadMoreButton
            };
          }
          return subject;
        })
      }
    }));
  };

  fetchMoreSubjects = ({ results, loadMoreButton }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        subjects: state.contentObj.subjects.concat(results),
        subjectLoadMoreButton: loadMoreButton
      }
    }));
  };

  fetchMoreSubjectComments = ({
    data: { comments, loadMoreButton },
    subjectId
  }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        subjects: state.contentObj.subjects.map(subject => {
          if (subject.id === subjectId) {
            return {
              ...subject,
              comments: subject.comments.concat(comments),
              loadMoreCommentsButton: loadMoreButton
            };
          }
          return subject;
        })
      }
    }));
  };

  fetchMoreSubjectReplies = ({ commentId, loadMoreButton, replies }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        subjects: state.contentObj.subjects.map(subject => {
          return {
            ...subject,
            comments: subject.comments.map(comment => {
              return {
                ...comment,
                replies:
                  comment.id === commentId
                    ? replies.concat(comment.replies)
                    : comment.replies,
                loadMoreButton:
                  comment.id === commentId
                    ? loadMoreButton
                    : comment.loadMoreButton
              };
            })
          };
        })
      }
    }));
  };

  fetchMoreReplies = ({ commentId, loadMoreButton, replies }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: state.contentObj.comments.map(comment => ({
          ...comment,
          replies:
            comment.id === commentId
              ? replies.concat(comment.replies)
              : comment.replies,
          loadMoreButton:
            comment.id === commentId ? loadMoreButton : comment.loadMoreButton
        }))
      }
    }));
  };

  likeComment = ({ commentId, likes }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: state.contentObj.comments.map(comment => {
          return {
            ...comment,
            likes: comment.id === commentId ? likes : comment.likes,
            replies: comment.replies.map(reply => {
              return {
                ...reply,
                likes: reply.id === commentId ? likes : reply.likes
              };
            })
          };
        }),
        subjects: state.contentObj.subjects.map(subject => {
          return {
            ...subject,
            comments: subject.comments.map(comment => {
              return {
                ...comment,
                likes: comment.id === commentId ? likes : comment.likes,
                replies: comment.replies.map(reply => {
                  return {
                    ...reply,
                    likes: reply.id === commentId ? likes : reply.likes
                  };
                })
              };
            })
          };
        })
      }
    }));
  };

  likeLink = likes => {
    const { likeLink } = this.props;
    const {
      contentObj: { id }
    } = this.state;
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        likes
      }
    }));
    likeLink({ likes, id });
  };

  loadLinkPage = async linkId => {
    try {
      const { data } = await request.get(`${URL}/url/page?linkId=${linkId}`);
      this.setState(state => ({
        contentObj: {
          ...state.contentObj,
          ...data
        }
      }));
    } catch (error) {
      console.error(error);
    }
  };

  setSubjectDifficulty = ({ contentId, difficulty }) => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        subjects: state.contentObj.subjects.map(subject => {
          return subject.id === contentId
            ? {
                ...subject,
                difficulty
              }
            : subject;
        })
      }
    }));
  };

  uploadComment = comment => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: [comment].concat(state.contentObj.comments),
        subjects: state.contentObj.subjects.map(subject => ({
          ...subject,
          comments:
            subject.id === comment.subjectId
              ? [comment].concat(subject.comments)
              : subject.comments
        }))
      }
    }));
  };

  uploadSubject = subject => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        subjects: [subject].concat(state.contentObj.subjects)
      }
    }));
  };

  uploadReply = reply => {
    this.setState(state => ({
      contentObj: {
        ...state.contentObj,
        comments: state.contentObj.comments.map(comment => ({
          ...comment,
          replies:
            comment.id === reply.replyId || comment.id === reply.commentId
              ? comment.replies.concat([reply])
              : comment.replies
        })),
        subjects: state.contentObj.subjects.map(subject => {
          return {
            ...subject,
            comments: subject.comments.map(comment => {
              return {
                ...comment,
                replies:
                  comment.id === reply.commentId || comment.id === reply.replyId
                    ? comment.replies.concat([reply])
                    : comment.replies
              };
            })
          };
        })
      }
    }));
  };
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar,
    pageProps: state.LinkReducer.linkPage,
    myId: state.UserReducer.userId
  }),
  dispatch => ({
    dispatch,
    editLinkPage: params => dispatch(editLinkPage(params)),
    likeLink: likes => dispatch(likeLink(likes))
  })
)(LinkPage);
