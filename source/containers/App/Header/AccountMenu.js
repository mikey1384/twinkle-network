import PropTypes from 'prop-types';
import React from 'react';
import Button from 'components/Button';
import DropdownButton from 'components/Buttons/DropdownButton';
import { openSigninModal } from 'redux/actions/UserActions';
import { connect } from 'react-redux';

AccountMenu.propTypes = {
  buttonStyle: PropTypes.object,
  className: PropTypes.string,
  loggedIn: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  openSigninModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  username: PropTypes.string
};

function AccountMenu({
  buttonStyle = {},
  className,
  history,
  loggedIn,
  openSigninModal,
  title,
  logout,
  username,
  ...props
}) {
  return loggedIn ? (
    <DropdownButton
      className={className}
      buttonStyle={buttonStyle}
      transparent
      listStyle={{ marginTop: '0.5rem' }}
      direction="left"
      text={
        <div
          style={{
            maxWidth: '10rem',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </div>
      }
      shape="button"
      icon="caret-down"
      iconSize="lg"
      menuProps={[
        {
          label: 'Profile',
          onClick: () => history.push(`/${username}`)
        },
        {
          label: 'Log out',
          onClick: logout
        }
      ]}
    />
  ) : (
    <Button
      className={className}
      onClick={openSigninModal}
      style={{ marginLeft: '1rem', ...buttonStyle }}
      success
      filled
    >
      <div
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
      >
        Log In
      </div>
    </Button>
  );
}

export default connect(
  state => ({
    username: state.UserReducer.username
  }),
  { openSigninModal }
)(AccountMenu);
