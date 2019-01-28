import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import ColorSelector from 'components/ColorSelector';
import Button from 'components/Button';
import AlertModal from 'components/Modals/AlertModal';
import ImageEditModal from 'components/Modals/ImageEditModal';
import { openDirectMessageChannel } from 'redux/actions/ChatActions';
import { uploadProfilePic } from 'redux/actions/UserActions';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { profileThemes } from 'constants/defaultValues';
import { connect } from 'react-redux';
import Icon from 'components/Icon';
import ChristmasCover from './christmas-cover.png';
import NewYearsCover from './newyears-cover.png';
import ValentinesCover from './valentines-cover.png';
import moment from 'moment';

class Cover extends Component {
  static propTypes = {
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

  state = {
    alertModalShown: false,
    colorSelectorShown: false,
    imageEditModalShown: false,
    imageUri: null,
    processing: false
  };

  backgroundImageObj = {
    black: {
      0: NewYearsCover,
      1: NewYearsCover,
      11: ChristmasCover
    },
    rose: {
      1: ValentinesCover
    }
  };

  render() {
    const {
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
      openDirectMessageChannel,
      selectedTheme
    } = this.props;
    const {
      alertModalShown,
      colorSelectorShown,
      imageEditModalShown,
      imageUri,
      processing
    } = this.state;
    return (
      <>
        <div
          style={{
            background:
              profileThemes[selectedTheme || profileTheme || 'logoBlue'].color,
            ...(rank <= 30 &&
            rank > 0 &&
            !!this.backgroundImageObj[selectedTheme || profileTheme]?.[
              moment().month()
            ]
              ? {
                  color: Color.gold(),
                  backgroundImage: `url(${
                    this.backgroundImageObj[selectedTheme || profileTheme][
                      moment().month()
                    ]
                  })`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat'
                }
              : { color: '#fff' })
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
                ${(selectedTheme || profileTheme) === 'black' &&
                rank <= 30 &&
                moment().month() === 11
                  ? `color: #000;`
                  : ''};
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
                onClick={() => this.setState({ colorSelectorShown: true })}
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
                    openDirectMessageChannel(
                      { userId },
                      { id, username },
                      false
                    )
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
                    onClick={this.onColorSelectCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ fontSize: '1.2rem' }}
                    primary
                    filled
                    onClick={this.onSetTheme}
                  >
                    Change
                  </Button>
                </div>
              </>
            )}
          </div>
          <input
            ref={ref => {
              this.fileInput = ref;
            }}
            style={{ display: 'none' }}
            type="file"
            onChange={this.handlePicture}
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
          onClick={userId === id ? () => this.fileInput.click() : undefined}
          profilePicId={profilePicId}
          online={userId === id || !!online}
          large
        />
        {imageEditModalShown && (
          <ImageEditModal
            imageUri={imageUri}
            onHide={() =>
              this.setState({
                imageUri: null,
                imageEditModalShown: false,
                processing: false
              })
            }
            processing={processing}
            onConfirm={this.uploadImage}
          />
        )}
        {alertModalShown && (
          <AlertModal
            title="Image is too large (limit: 5mb)"
            content="Please select a smaller image"
            onHide={() => this.setState({ alertModalShown: false })}
          />
        )}
      </>
    );
  }

  onColorSelectCancel = () => {
    const {
      onSelectTheme,
      profile: { profileTheme }
    } = this.props;
    onSelectTheme(profileTheme || 'logoBlue');
    this.setState({ colorSelectorShown: false });
  };

  onSetTheme = async() => {
    const { onSetTheme } = this.props;
    this.setState({ colorSelectorShown: false });
    onSetTheme();
  };

  handlePicture = event => {
    const reader = new FileReader();
    const maxSize = 5000;
    const file = event.target.files[0];
    if (file.size / 1000 > maxSize) {
      return this.setState({ alertModalShown: true });
    }
    reader.onload = upload => {
      this.setState({
        imageEditModalShown: true,
        imageUri: upload.target.result
      });
    };

    reader.readAsDataURL(file);
    event.target.value = null;
  };

  uploadImage = async image => {
    const { uploadProfilePic } = this.props;
    this.setState({
      processing: true
    });
    await uploadProfilePic(image);
    this.setState({
      imageUri: null,
      processing: false,
      imageEditModalShown: false
    });
  };
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
