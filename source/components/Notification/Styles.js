import { css } from 'emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1.5rem;
  section {
    min-height: 30vh;
  }
  li, a {
    line-height: 2rem;
  }
  @media (max-width: ${mobileMaxWidth}) {
    margin-bottom: 2rem;
    margin-top: 2rem;
    border-radius: 0;
    font-size: 2.5rem;
    button {
      font-size: 2.5rem;
    }
    h4 {
      font-size: 3rem;
    }
  }
`
