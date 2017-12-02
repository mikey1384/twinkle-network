import React from 'react'
import Styles from './Styles'

export default function Rankings() {
  return (
    <div
      className="col-xs-offset-8"
      style={Styles.rightMenu}
    >
      <p style={{...Styles.subHeader, textAlign: 'center'}}>
        Rankings
      </p>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img
          alt='thumbnail'
          style={{width: '20%', height: '20%'}}
          src={`https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/pictures/5/25.jpg`}
        />
        <div
          style={{
            padding: '0 1rem 0 1rem',
            width: '80%'
          }}
        >
          <span style={{fontSize: '1.2em'}}>Sonic</span>
        </div>
      </div>
    </div>
  )
}
