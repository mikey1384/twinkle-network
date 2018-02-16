import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  margin-top: 1rem;
  @media (max-width: ${mobileMaxWidth}) {
    margin-top: 2rem;
    border-radius: 0;
    font-size: 2.5rem;
    .well {
      border-radius: 0;
    }
    button {
      font-size: 2.5rem;
    }
    h4 {
      font-size: 3rem;
    }
  }
`
