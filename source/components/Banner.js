import React from 'react'
import Button from 'components/Button'
import { css } from 'emotion'
import { Color } from 'constants/css'

export default function Banner() {
  return (
    <div
      className={css`
        position: absolute;
        padding: 1rem;
        background: ${Color.blue()};
        text-align: center;
        width: 80%;
        height: 20rem;
        left: 10%;
        top: 2rem;
        z-index: 2000;
        font-size: 2rem;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
      `}
    >
      <p>
        The website has been updated. Click the button below to apply the
        update.
      </p>
      <p style={{ fontSize: '1.2em' }}>
        {
          "Warning: Update is mandatory. Some features will not work properly if you don't update!"
        }
      </p>
      <Button
        gold
        filled
        style={{ marginTop: '3rem', width: '20%', alignSelf: 'center' }}
        onClick={() => window.location.reload()}
      >
        Update!
      </Button>
    </div>
  )
}
