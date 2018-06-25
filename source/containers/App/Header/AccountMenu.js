import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'
import DropdownButton from 'components/Buttons/DropdownButton'
import { openSigninModal } from 'redux/actions/UserActions'
import { connect } from 'react-redux'

AccountMenu.propTypes = {
  loggedIn: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  openSigninModal: PropTypes.func.isRequired,
  title: PropTypes.string
}
function AccountMenu({ loggedIn, openSigninModal, title, logout, ...props }) {
  return loggedIn ? (
    <DropdownButton
      {...props}
      transparent
      listStyle={{ marginTop: '0.5rem', width: '11rem' }}
      direction="left"
      text={title}
      shape="button"
      icon="triangle-bottom"
      menuProps={[
        {
          label: 'Log out',
          onClick: logout
        }
      ]}
    />
  ) : (
    <Button
      onClick={openSigninModal}
      style={{ marginLeft: '1rem' }}
      success
      filled
    >
      Log In
    </Button>
  )
}

export default connect(
  null,
  { openSigninModal }
)(AccountMenu)
