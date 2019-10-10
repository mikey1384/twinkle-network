import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import UserListModal from 'components/Modals/UserListModal';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTitleForm from 'components/Texts/EditTitleForm';
import ConfirmModal from 'components/Modals/ConfirmModal';
import Embedly from 'components/Embedly';
import { withRouter } from 'react-router-dom';
import { cleanString } from 'helpers/stringHelpers';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useAppContext, useContentContext, useExploreContext } from 'contexts';

LinkItem.propTypes = {
  history: PropTypes.object.isRequired,
  link: PropTypes.shape({
    content: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    numComments: PropTypes.number,
    siteUrl: PropTypes.string,
    thumbUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    uploader: PropTypes.object.isRequired,
    likes: PropTypes.array.isRequired
  }).isRequired
};

function LinkItem({
  history,
  link: { id, numComments, likes, timeStamp, title, uploader, ...embedProps }
}) {
  const {
    user: {
      state: { authLevel, canDelete, canEdit, userId }
    },
    requestHelpers: { deleteContent, editContent }
  } = useAppContext();
  const {
    state,
    actions: { onDeleteLink, onEditLinkTitle }
  } = useExploreContext();
  const {
    actions: { onInitContent }
  } = useContentContext();
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  useEffect(() => {
    if (!state['url' + id]) {
      onInitContent({
        contentId: id,
        contentType: 'url',
        id,
        likes,
        timeStamp,
        title,
        uploader,
        ...embedProps
      });
    }
  }, []);
  const userIsUploader = userId === uploader.id;
  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploader.authLevel;
  const editButtonShown = userIsUploader || userCanEditThis;
  const editMenuItems = [];
  if (userIsUploader || canEdit) {
    editMenuItems.push({
      label: 'Edit',
      onClick: () => setOnEdit(true)
    });
  }
  if (userIsUploader || canDelete) {
    editMenuItems.push({
      label: 'Remove',
      onClick: () => setConfirmModalShown(true)
    });
  }

  return (
    <nav
      className={css`
        display: flex;
        width: 100%;
        section {
          width: 100%;
          margin-left: 2rem;
          display: flex;
          justify-content: space-between;
        }
      `}
    >
      <div
        onMouseUp={() => {
          if (!onEdit) history.push(`/links/${id}`);
        }}
        style={{ cursor: !onEdit && 'pointer' }}
        className={css`
          position: relative;
          width: 20%;
          &:after {
            content: '';
            display: block;
            padding-bottom: 35%;
          }
        `}
      >
        <Embedly
          imageOnly
          noLink
          style={{ width: '100%', height: '100%' }}
          loadingHeight="6rem"
          contentId={id}
        />
      </div>
      <section
        onMouseUp={() => {
          if (!onEdit) history.push(`/links/${id}`);
        }}
        style={{ cursor: !onEdit && 'pointer' }}
      >
        <div
          className={css`
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
          `}
        >
          <div style={{ width: '100%' }}>
            <div
              className={css`
                width: 100%;
                a {
                  font-size: 2rem;
                  line-height: 1.2;
                  font-weight: bold;
                }
              `}
            >
              {!onEdit && (
                <span
                  style={{
                    color: Color.blue(),
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {cleanString(title)}
                </span>
              )}
              {onEdit && (
                <EditTitleForm
                  autoFocus
                  style={{ width: '80%' }}
                  maxLength={200}
                  title={title}
                  onEditSubmit={handleEditedTitleSubmit}
                  onClickOutSide={() => setOnEdit(false)}
                />
              )}
            </div>
            <div
              style={{
                fontSize: '1.2rem',
                lineHeight: '2rem'
              }}
            >
              Uploaded {`${timeSince(timeStamp)} `}
              by <UsernameText user={uploader} />
            </div>
          </div>
          <div
            className={css`
              font-size: 1.3rem;
              font-weight: bold;
              color: ${Color.darkerGray()};
              margin-bottom: 0.5rem;
            `}
          >
            {likes.length > 0 && (
              <>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => setUserListModalShown(true)}
                >
                  {`${likes.length}`} like
                  {likes.length > 1 ? 's' : ''}
                </span>
                &nbsp;&nbsp;
              </>
            )}
            {numComments > 0 && (
              <span>
                {numComments} comment
                {numComments > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </section>
      {!onEdit && editButtonShown && (
        <div>
          <DropdownButton
            skeuomorphic
            color="darkerGray"
            direction="left"
            menuProps={editMenuItems}
          />
        </div>
      )}
      {confirmModalShown && (
        <ConfirmModal
          title="Remove Link"
          onConfirm={handleDelete}
          onHide={() => setConfirmModalShown(false)}
        />
      )}
      {userListModalShown && (
        <UserListModal
          users={likes}
          description="(You)"
          onHide={() => setUserListModalShown(false)}
          title="People who liked this link"
        />
      )}
    </nav>
  );

  async function handleDelete() {
    await deleteContent({ id, contentType: 'url' });
    onDeleteLink(id);
  }

  async function handleEditedTitleSubmit(text) {
    await editContent({ editedTitle: text, contentId: id, contentType: 'url' });
    onEditLinkTitle({ title: text, id });
    setOnEdit(false);
  }
}

export default withRouter(LinkItem);
