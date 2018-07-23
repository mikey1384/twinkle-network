import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  height: 100%;
  @media (max-width: ${mobileMaxWidth}) {
    display: flex;
  }
`

export const Left = css`
  width: CALC(20vw - 1rem);
  left: 5vw;
  display: block;
  position: fixed;
  @media (max-width: ${mobileMaxWidth}) {
    display: none;
  }
`

export const Center = css`
  width: 42vw;
  height: 100%;
  margin-left: 25vw;
  @media (max-width: ${mobileMaxWidth}) {
    width: 100%;
    margin-left: 0;
  }
`

export const Right = css`
  width: CALC(28vw - 1rem);
  right: 5vw;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  top: 6rem;
  max-height: CALC(100% - 6rem);
  position: fixed;
  @media (max-width: ${mobileMaxWidth}) {
    display: none;
  }
`
