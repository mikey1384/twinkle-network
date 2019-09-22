import PropTypes from 'prop-types';
import React from 'react';
import Button from 'components/Button';
import DropdownButton from 'components/Buttons/DropdownButton';
import { useAppContext } from 'context';

AccountMenu.propTypes = {
  buttonStyle: PropTypes.object,
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function AccountMenu({
  buttonStyle = {},
  className,
  history,
  style
}) {
  const {
    user: {
      state: { loggedIn, username },
      actions: { onLogout, onOpenSigninModal }
    }
  } = useAppContext();
  return (
    <div style={style}>
      {loggedIn ? (
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
              {username}
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
              onClick: onLogout
            }
          ]}
        />
      ) : (
        <Button
          className={className}
          onClick={onOpenSigninModal}
          style={{ marginLeft: '1rem', ...buttonStyle }}
          color="green"
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
      )}
    </div>
  );
}
