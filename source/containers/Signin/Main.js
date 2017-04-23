import React from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'

Main.propTypes = {
  showLoginForm: PropTypes.func,
  showSignUpForm: PropTypes.func
}
export default function Main({showLoginForm, showSignUpForm}) {
  return (
    <div>
      <div>
        <Button
          className="btn btn-lg btn-success"
          style={{fontSize: '2em', padding: '1em'}}
          onClick={showLoginForm}
        >
          Yes, I have an account
        </Button>
      </div>
      <div style={{marginTop: '1em'}}>
        <Button
          className="btn btn-lg btn-primary"
          style={{fontSize: '1.5em', padding: '1em'}}
          onClick={showSignUpForm}
        >No, I'm a new user. Make me a new account, please!</Button>
      </div>
    </div>
  )
}
