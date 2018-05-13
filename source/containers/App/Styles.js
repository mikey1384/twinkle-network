import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const siteContent = css`
  margin-top: 6rem;
  padding-top: 1rem;
  height: 100%;
  @media (max-width: ${mobileMaxWidth}) {
    margin-top: 0;
    padding-bottom: 9rem;
  }
`
