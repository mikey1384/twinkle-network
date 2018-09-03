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
  openSigninModal: PropTypes.func.isRequired,
  title: PropTypes.string
};
function AccountMenu({
  buttonStyle = {},
  className,
  loggedIn,
  openSigninModal,
  title,
  logout,
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
  null,
  { openSigninModal }
)(AccountMenu);
