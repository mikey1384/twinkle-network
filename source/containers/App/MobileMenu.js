import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import HomeMenuItems from 'components/HomeMenuItems';
import ProfileWidget from 'components/ProfileWidget';
import Notification from 'components/Notification';
import AlertModal from 'components/Modals/AlertModal';
import ImageEditModal from 'components/Modals/ImageEditModal';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/ErrorBoundary';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext, useContentContext } from 'contexts';

MobileMenu.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

export default function MobileMenu({ location, history, onClose }) {
  const {
    user: {
      actions: { onLogout }
    },
    requestHelpers: { uploadProfilePic }
  } = useAppContext();
  const {
    actions: { onResetChat }
  } = useChatContext();
  const {
    actions: { onUploadProfilePic }
  } = useContentContext();
  const { userId, username } = useMyState();
  const [marginLeft, setMarginLeft] = useState('-100%');

  useEffect(() => {
    if (marginLeft !== '-100%') {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    setMarginLeft(0);
  }, []);

  const [alertModalShown, setAlertModalShown] = useState(false);
  const [imageEditStatus, setImageEditStatus] = useState({
    imageEditModalShown: false,
    imageUri: null,
    processing: false
  });
  const { imageEditModalShown, imageUri, processing } = imageEditStatus;

  return (
    <ErrorBoundary
      className={`mobile ${css`
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: fixed;
        z-index: 40000;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
      `}`}
    >
      <div
        className={`momentum-scroll-enabled ${css`
          height: 100%;
          width: 70%;
          position: relative;
          background: ${Color.whiteGray()};
          margin-left: ${marginLeft};
          transition: margin-left 0.5s;
          overflow-y: scroll;
        `}`}
      >
        <ProfileWidget
          history={history}
          onShowAlert={() => setAlertModalShown(true)}
          onLoadImage={upload =>
            setImageEditStatus({
              ...imageEditStatus,
              imageEditModalShown: true,
              imageUri: upload.target.result
            })
          }
        />
        <HomeMenuItems
          history={history}
          location={location}
          style={{ marginTop: '1rem' }}
        />
        <Notification location="home" />
        {username && (
          <div
            className={css`
              background: #fff;
              width: 100%;
              text-align: center;
              color: ${Color.red()};
              font-size: 3rem;
              padding: 1rem;
              margin-top: 1rem;
            `}
            onClick={handleLogout}
          >
            Log out
          </div>
        )}
      </div>
      <div style={{ width: '30%', position: 'relative' }} onClick={onClose}>
        <Icon
          icon="times"
          style={{
            color: '#fff',
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            fontSize: '4rem',
            opacity: '0.8'
          }}
        />
      </div>
      {imageEditModalShown && (
        <ImageEditModal
          imageUri={imageUri}
          onHide={() =>
            setImageEditStatus({
              imageUri: null,
              imageEditModalShown: false,
              processing: false
            })
          }
          processing={processing}
          onConfirm={uploadImage}
        />
      )}
      {alertModalShown && (
        <AlertModal
          title="Image is too large (limit: 5mb)"
          content="Please select a smaller image"
          onHide={() => setAlertModalShown(false)}
        />
      )}
    </ErrorBoundary>
  );

  function handleLogout() {
    onLogout();
    onResetChat();
  }

  async function uploadImage(image) {
    setImageEditStatus({
      ...imageEditStatus,
      processing: true
    });
    const data = await uploadProfilePic({ image });
    onUploadProfilePic({ userId, ...data });
    setImageEditStatus({
      imageUri: null,
      processing: false,
      imageEditModalShown: false
    });
  }
}
