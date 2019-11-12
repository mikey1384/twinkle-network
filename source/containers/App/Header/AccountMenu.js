import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import DropdownButton from 'components/Buttons/DropdownButton';
import { useAppContext, useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

AccountMenu.propTypes = {
  buttonStyle: PropTypes.object,
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function AccountMenu({ className, history, style = {} }) {
  const {
    user: {
      actions: { onLogout, onOpenSigninModal }
    }
  } = useAppContext();
  const {
    actions: { onResetChat }
  } = useChatContext();
  const { loggedIn, username, userType } = useMyState();
  let menuProps = [
    {
      label: 'Profile',
      onClick: () => history.push(`/${username}`)
    }
  ];
  if (userType) {
    menuProps.push({
      label: 'Management',
      onClick: () => history.push('/management')
    });
  }
  menuProps.push({
    label: 'Log out',
    onClick: handleLogout
  });

  return useMemo(
    () => (
      <div style={style}>
        {loggedIn ? (
          <DropdownButton
            className={className}
            transparent
            listStyle={{
              marginTop: '0.2rem',
              width: '13rem',
              marginRight: '1rem'
            }}
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
            menuProps={menuProps}
          />
        ) : (
          <Button
            className={className}
            onClick={onOpenSigninModal}
            style={{ marginLeft: '1rem' }}
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
    ),
    [loggedIn, username]
  );

  function handleLogout() {
    onLogout();
    onResetChat();
  }
}
