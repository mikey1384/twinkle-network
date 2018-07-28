import React, { Component } from 'react'
import { Color } from 'constants/css'
import CloseText from './CloseText'

export default class Instructions extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center'
        }}
      >
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
            {`You can search for contents posted on this website.
            Type in keywords and use the filter bar above to narrow down your
            search results by content types (videos, users, links, posts, comments)`}
          </p>
        </div>
        <CloseText />
      </div>
    )
  }
}
