import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Playlist from 'components/Playlist'

export default class Content extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  }

  state = {
    background: null,
    title: ''
  }

  render() {
    const {
      match: {
        params: { contentId }
      }
    } = this.props
    const { title } = this.state
    const { background } = this.state
    return (
      <div
        style={{
          background,
          padding: '1rem'
        }}
      >
        {title && (
          <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>{title}</p>
        )}
        <div style={{ marginTop: '1rem' }}>
          <Playlist
            playlistId={Number(contentId)}
            onLoad={({ exists, title }) =>
              this.setState({ background: exists ? '#fff' : null, title })
            }
          />
        </div>
      </div>
    )
  }
}
