import React, { Component } from 'react'
import { Color } from 'constants/css'

export default class Instructions extends Component {
  render() {
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
            {`You can search for almost any content posted on this website.
            Type in keywords and use the filter bar above to narrow down your
            search results by content types (videos, users, links, posts, comments)`}
          </p>
        </div>
      </div>
    )
  }
}
