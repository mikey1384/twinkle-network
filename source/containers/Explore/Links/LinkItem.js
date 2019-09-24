import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import UserListModal from 'components/Modals/UserListModal';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTitleForm from 'components/Texts/EditTitleForm';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { Link } from 'react-router-dom';
import { cleanString } from 'helpers/stringHelpers';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useAppContext } from 'context';
import request from 'axios';
import URL from 'constants/URL';

LinkItem.propTypes = {
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

const API_URL = `${URL}/content`;
const fallbackImage = '/img/link.png';

export default function LinkItem({
  link: {
    id,
    numComments,
    content,
    likes,
    siteUrl,
    thumbUrl,
    title,
    timeStamp,
    uploader
  }
}) {
  const {
    explore: {
      actions: { onDeleteLink, onEditLinkTitle }
    },
    user: {
      state: { authLevel, canDelete, canEdit, userId }
    },
    requestHelpers: { deleteContent, editContent }
  } = useAppContext();
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    thumbUrl ? thumbUrl.replace('http://', 'https://') : '/img/link.png'
  );
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      if (content && !siteUrl) {
        try {
          const {
            data: { image }
          } = await request.put(`${API_URL}/embed`, {
            url: content,
            linkId: id
          });
          if (mounted.current) {
            setImageUrl(image.url.replace('http://', 'https://'));
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    return function cleanUp() {
      mounted.current = false;
    };
  }, [content]);

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
        className={css`
          position: relative;
          width: 20%;
          &:after {
            content: '';
            display: block;
            padding-bottom: 100%;
          }
        `}
      >
        <Link to={`/links/${id}`}>
          <img
            className={css`
              position: absolute;
              width: 100%;
              height: 100%;
              object-fit: cover;
            `}
            src={imageUrl}
            onError={handleImageLoadError}
            alt=""
          />
        </Link>
      </div>
      <section>
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
              {!onEdit && <Link to={`/links/${id}`}>{cleanString(title)}</Link>}
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
        <div>
          {!onEdit && editButtonShown && (
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              direction="left"
              menuProps={editMenuItems}
            />
          )}
        </div>
      </section>
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

  function handleImageLoadError() {
    setImageUrl(!thumbUrl || imageUrl === thumbUrl ? fallbackImage : thumbUrl);
  }
}
