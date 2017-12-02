import PropTypes from 'prop-types'
import React from 'react'
import DropdownButton from 'components/DropdownButton'

AccountMenu.propTypes = {
  logout: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}
export default function AccountMenu({title, logout, ...props}) {
  return (
    <DropdownButton
      {...props}
      text={title}
      shape="button"
      icon="triangle-bottom"
      menuProps={[{
        label: 'Log out',
        onClick: () => logout()
      }]}
    />
  )
}
