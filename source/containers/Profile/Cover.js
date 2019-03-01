import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import ColorSelector from 'components/ColorSelector';
import Button from 'components/Button';
import AlertModal from 'components/Modals/AlertModal';
import ImageEditModal from 'components/Modals/ImageEditModal';
import Icon from 'components/Icon';
import moment from 'moment';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { openDirectMessageChannel } from 'redux/actions/ChatActions';
import { uploadProfilePic } from 'redux/actions/UserActions';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { profileThemes } from 'constants/defaultValues';
import { connect } from 'react-redux';

Cover.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    online: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    profilePicId: PropTypes.number,
    profileTheme: PropTypes.string,
    realName: PropTypes.string,
    username: PropTypes.string
  }),
  openDirectMessageChannel: PropTypes.func.isRequired,
  onSelectTheme: PropTypes.func.isRequired,
  onSetTheme: PropTypes.func.isRequired,
  selectedTheme: PropTypes.string,
  uploadProfilePic: PropTypes.func,
  userId: PropTypes.number
};

const ChristmasCover = '/img/christmas-cover.png';
const MarchFirstCover = '/img/march-first-cover.png';
const MarchCover = '/img/march-cover.png';
const NewYearsCover = '/img/newyears-cover.png';
const ValentinesCover = '/img/valentines-cover.png';

const backgroundImageObj = {
  black: {
    0: NewYearsCover,
    1: NewYearsCover,
    2: MarchFirstCover,
    11: ChristmasCover
  },
  rose: {
    1: ValentinesCover
  },
  logoBlue: {
    2: MarchCover
  }
};

function Cover({
  userId,
  profile: {
    id,
    rank,
    profilePicId,
    online,
    profileTheme,
    realName,
    twinkleXP,
    username
  },
  onSelectTheme,
  onSetTheme,
  openDirectMessageChannel,
  uploadProfilePic,
  selectedTheme
}) {
  const showCover =
    rank <= 30 &&
    rank > 0 &&
    !!backgroundImageObj[selectedTheme || profileTheme]?.[moment().month()];
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [colorSelectorShown, setColorSelectorShown] = useState(false);
  const [imageEditModalShown, setImageEditModalShown] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [processing, setProcessing] = useState(false);
  const FileInputRef = useRef(null);

  useEffect(() => {
    onSelectTheme(profileTheme || 'logoBlue');
  }, []);
  return (
    <ErrorBoundary>
      <div
        style={{
          color:
            showCover &&
            ['black', 'rose'].indexOf(selectedTheme || profileTheme) !== -1
              ? Color.gold()
              : '#fff',
          backgroundImage: showCover
            ? `url(${
                backgroundImageObj[selectedTheme || profileTheme][
                  moment().month()
                ]
              })`
            : undefined,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundColor:
            profileThemes[selectedTheme || profileTheme || 'logoBlue'].color
        }}
        className={css`
          height: 26rem;
          margin-top: -1rem;
          display: flex;
          justify-content: space-between;
          width: 100%;
          position: relative;
          @media (max-width: ${mobileMaxWidth}) {
            height: 12rem;
          }
        `}
      >
        <div
          className={css`
            margin-left: 29rem;
            font-size: 5rem;
            padding-top: 15rem;
            font-weight: bold;
            > p {
              font-size: 2rem;
              line-height: 1rem;
            }
            @media (max-width: ${mobileMaxWidth}) {
              margin-left: 15rem;
              padding-top: 5.5rem;
              font-size: 3rem;
              > p {
                font-size: 1.3rem;
              }
            }
          `}
        >
          {username}
          <p>({realName})</p>
        </div>
        <div
          style={{
            background: colorSelectorShown && '#fff',
            borderRadius,
            position: 'absolute',
            padding: '1rem',
            bottom: '1rem',
            right: '1rem'
          }}
        >
          {!colorSelectorShown && id === userId && (
            <Button
              style={{ marginBottom: '-1rem', marginRight: '-1rem' }}
              default
              filled
              onClick={() => setColorSelectorShown(true)}
            >
              Change Theme
            </Button>
          )}
          {id !== userId && (
            <div
              style={{
                background: '#fff',
                marginBottom: '-1rem',
                marginRight: '-1rem',
                borderRadius
              }}
            >
              <Button
                style={{
                  width: '100%',
                  color: Color[selectedTheme || profileTheme || 'logoBlue']()
                }}
                snow
                onClick={() =>
                  openDirectMessageChannel({ userId }, { id, username }, false)
                }
              >
                <Icon icon="comments" />
                <span style={{ marginLeft: '0.7rem' }}>
                  Chat
                  <span className="desktop"> with {username}</span>
                </span>
              </Button>
            </div>
          )}
          {colorSelectorShown && id === userId && (
            <>
              <ColorSelector
                colors={[
                  'logoBlue',
                  'green',
                  'orange',
                  'pink',
                  'rose',
                  'black'
                ]}
                twinkleXP={twinkleXP || 0}
                setColor={onSelectTheme}
                selectedColor={selectedTheme || profileTheme || 'logoBlue'}
                style={{
                  width: '100%',
                  height: 'auto',
                  justifyContent: 'center'
                }}
              />
              <div
                style={{
                  display: 'flex',
                  marginTop: '1rem',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  style={{ fontSize: '1.2rem', marginRight: '1rem' }}
                  snow
                  onClick={onColorSelectCancel}
                >
                  Cancel
                </Button>
                <Button
                  style={{ fontSize: '1.2rem' }}
                  primary
                  filled
                  onClick={handleSetTheme}
                >
                  Change
                </Button>
              </div>
            </>
          )}
        </div>
        <input
          ref={FileInputRef}
          style={{ display: 'none' }}
          type="file"
          onChange={handlePicture}
          accept="image/*"
        />
      </div>
      <ProfilePic
        isProfilePage
        className={css`
          width: 22rem;
          height: 22rem;
          left: 3rem;
          top: 7rem;
          font-size: 2rem;
          z-index: 10;
          @media (max-width: ${mobileMaxWidth}) {
            width: 12rem;
            height: 12rem;
            left: 1rem;
            top: 4rem;
          }
        `}
        style={{ position: 'absolute' }}
        userId={id}
        onClick={userId === id ? () => FileInputRef.current.click() : undefined}
        profilePicId={profilePicId}
        online={userId === id || !!online}
        large
      />
      {imageEditModalShown && (
        <ImageEditModal
          imageUri={imageUri}
          onHide={() => {
            setImageUri(null);
            setImageEditModalShown(false);
            setProcessing(false);
          }}
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

  function onColorSelectCancel() {
    onSelectTheme(profileTheme || 'logoBlue');
    setColorSelectorShown(false);
  }

  async function handleSetTheme() {
    setColorSelectorShown(false);
    onSetTheme();
  }

  function handlePicture(event) {
    const reader = new FileReader();
    const maxSize = 5000;
    const file = event.target.files[0];
    if (file.size / 1000 > maxSize) {
      return setAlertModalShown(true);
    }
    reader.onload = upload => {
      setImageEditModalShown(true);
      setImageUri(upload.target.result);
    };

    reader.readAsDataURL(file);
    event.target.value = null;
  }

  async function uploadImage(image) {
    setProcessing(true);
    await uploadProfilePic(image);
    setImageUri(null);
    setProcessing(false);
    setImageEditModalShown(false);
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId
  }),
  {
    openDirectMessageChannel,
    uploadProfilePic
  }
)(Cover);
