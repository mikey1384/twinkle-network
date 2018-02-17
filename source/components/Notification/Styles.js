import { css } from 'emotion'
import { mobileMaxWidth } from 'constants/css'

export const styles = css`
  margin-bottom: 1rem;
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
