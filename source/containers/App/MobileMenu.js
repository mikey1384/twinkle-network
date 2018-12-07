import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HomeMenuItems from 'components/HomeMenuItems';
import ProfileWidget from 'components/ProfileWidget';
import { Color } from 'constants/css';
import Notification from 'components/Notification';
import { connect } from 'react-redux';
import { logout, uploadProfilePic } from 'redux/actions/UserActions';
import { css } from 'emotion';
import AlertModal from 'components/Modals/AlertModal';
import ImageEditModal from 'components/Modals/ImageEditModal';
import Icon from 'components/Icon';

class MobileMenu extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    location: PropTypes.object,
    logout: PropTypes.func.isRequired,
    history: PropTypes.object,
    uploadProfilePic: PropTypes.func,
    username: PropTypes.string,
    onClose: PropTypes.func.isRequired
  };

  state = {
    alertModalShown: false,
    imageEditModalShown: false,
    imageUri: null,
    marginLeft: '-100%',
    processing: false
  };
  componentDidMount() {
    this.setState({ marginLeft: 0 });
  }

  componentDidUpdate(prevProps) {
    const { chatMode, location, onClose } = this.props;
    if (location !== prevProps.location) {
      onClose();
    }
    if (chatMode !== prevProps.chatMode) {
      onClose();
    }
  }

  render() {
    const { location, history, logout, username, onClose } = this.props;
    const {
      alertModalShown,
      imageEditModalShown,
      imageUri,
      marginLeft,
      processing
    } = this.state;
    return (
      <div
        className={`mobile ${css`
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          position: fixed;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
        `}`}
      >
        <div
          className={`momentum-scroll-enabled ${css`
            height: 100%;
            width: 70%;
            position: relative;
            background: ${Color.backgroundGray()};
            margin-left: ${marginLeft};
            transition: margin-left 0.5s;
            overflow-y: scroll;
          `}`}
        >
          <ProfileWidget
            history={history}
            showAlert={() => this.setState({ alertModalShown: true })}
            loadImage={upload =>
              this.setState({
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
          <Notification />
          {username && (
            <div
              className={css`
                background: #fff;
                width: 100%;
                text-align: center;
                color: ${Color.red()};
                font-size: 3rem;
                padding: 1rem;
              `}
              onClick={logout}
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
      </div>
    );
  }

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
  { logout, uploadProfilePic }
)(MobileMenu);
