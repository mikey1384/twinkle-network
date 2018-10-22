import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import ColorSelector from 'components/ColorSelector';
import Button from 'components/Button';
import { borderRadius } from 'constants/css';
import { profileThemes } from 'constants/defaultValues';
import { connect } from 'react-redux';

class Cover extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired,
      profileTheme: PropTypes.string
    }),
    userId: PropTypes.number
  };

  state = {
    colorSelectorShown: false
  };

  render() {
    const {
      userId,
      profile: {
        id,
        profilePicId,
        online,
        profileTheme = 'blue',
        realName,
        username
      }
    } = this.props;
    const { colorSelectorShown } = this.state;
    return (
      <>
        <div
          style={{
            ...profileThemes[profileTheme],
            height: '23rem',
            marginTop: '-1rem',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            position: 'relative'
          }}
        >
          <div
            style={{
              marginLeft: '30rem',
              color: '#fff',
              fontSize: '5rem',
              paddingTop: '12rem'
            }}
          >
            {username}
            <p style={{ fontSize: '2rem', lineHeight: '1rem' }}>({realName})</p>
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
            {!colorSelectorShown && (
              <Button
                style={{ marginBottom: '-1rem', marginRight: '-1rem' }}
                default
                filled
                onClick={() => this.setState({ colorSelectorShown: true })}
              >
                Change Theme
              </Button>
            )}
            {colorSelectorShown && (
              <>
                <ColorSelector
                  colors={['logoBlue', 'gold', 'red']}
                  setColor={() => console.log('color')}
                  selectedColor={profileTheme}
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
                    onClick={() => this.setState({ colorSelectorShown: false })}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ fontSize: '1.2rem' }}
                    primary
                    filled
                    onClick={() => this.setState({ colorSelectorShown: false })}
                  >
                    Change
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <ProfilePic
          style={{
            position: 'absolute',
            width: '22rem',
            height: '22rem',
            left: '3rem',
            top: '5rem',
            fontSize: '2rem',
            zIndex: 10
          }}
          userId={id}
          profilePicId={profilePicId}
          online={userId === id || !!online}
          large
        />
      </>
    );
  }
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(Cover);
