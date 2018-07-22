import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  width: 120rem;
  height: 100%;
  @media (max-width: 991px) {
    display: flex;
  }
`

export const Left = css`
  position: fixed;
  left: 7rem;
  display: block;
  width: 28rem;
  @media (max-width: ${mobileMaxWidth}) {
    display: none;
  }
`

export const Center = css`
  width: CALC(100vw - 45rem - 35rem - 2rem);
  height: 100%;
  margin-left: 36rem;
  @media (max-width: ${mobileMaxWidth}) {
    width: 100%;
    margin-left: 0;
  }
`

export const Right = css`
  width: 38rem;
  right: 7rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  top: 6rem;
  max-height: CALC(100% - 6rem);
  position: absolute;
  @media (max-width: ${mobileMaxWidth}) {
    display: none;
  }
`
