import React from 'react'
import {Color} from 'constants/css'

export default function TwinkleXP() {
  return (
    <div className="container-fluid">
      <div className="col-xs-8">
        <div
          style={{
            background: 'white',
            padding: '1.5rem'
          }}
        >
          <p
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
            About <span style={{color: Color.logoGreen}}>Twin</span><span style={{color: Color.logoBlue}}>kle</span> <span style={{color: Color.orange}}>XP</span>
          </p>
        </div>
      </div>
      <div
        className="col-xs-offset-8 col-xs-5"
        style={{
          width: '30%',
          position: 'absolute',
          background: 'white',
          padding: '1.5rem'
        }}
      >
        <p
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Rankings
        </p>
      </div>
    </div>
  )
}
