import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const siteContent = css`
  margin-top: 65px;
  @media (max-width: ${mobileMaxWidth}) {
    margin-top: 0;
    margin-bottom: 9rem;
  }
`
