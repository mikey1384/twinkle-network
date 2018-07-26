import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import request from 'axios'
import { URL } from 'constants/URL'

export default class Redirect extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    const {
      match: {
        params: { username }
      },
      history
    } = this.props
    return request
      .get(`${URL}/user/check?username=${username}`)
      .then(({ data: userExists }) => {
        if (userExists) return history.push(`/users/${username}`)
        this.setState({ loaded: true })
      })
  }

  render() {
    const { loaded } = this.state
    return (
      <div>
        {loaded ? <NotFound /> : <Loading relative text="Loading..." />}
      </div>
    )
  }
}
