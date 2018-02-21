import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const appStyle = css`
  height: 100%;
  width: 100%;
`

export const siteContent = css`
  margin-top: 6.5rem;
  @media (max-width: ${mobileMaxWidth}) {
    margin-top: 0;
    padding-bottom: 9rem;
  }
`
