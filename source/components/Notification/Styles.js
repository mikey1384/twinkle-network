import { css } from 'emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1.5rem;
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    > section {
      min-height: 0;
    }
  }
`
