import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Color } from 'constants/css'

export default class Instructions extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired
  }
  render() {
    const { onClose } = this.props
    return (
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <div
          style={{
            height: '50vh',
            width: '80%',
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '3rem',
            fontWeight: 'bold',
            color: Color.gray()
          }}
        >
          <p>
            {`You can search for almost any content posted by users of this website.
            Type in keywords and use the filter bar above to narrow down your
            search results by content types (videos, users, links, posts, comments)`}
          </p>
          <p style={{ marginTop: '5rem', color: Color.darkGray() }}>
            Tap{' '}
            <a style={{ cursor: 'pointer' }} onClick={onClose}>
              here
            </a>{' '}
            to close
          </p>
        </div>
      </div>
    )
  }
}
