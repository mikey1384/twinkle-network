import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  width: 100%;
  height: 100%;
  @media (max-width: 991px) {
    display: flex;
  }
`

export const Left = css`
  position: fixed;
  left: 1rem;
  display: block;
  width: CALC(15% + 2rem);
  @media (max-width: ${mobileMaxWidth}) {
    display: none;
  }
`

export const Center = css`
  width: CALC(55% - 6rem);
  height: 100%;
  margin-left: calc(15% + 4rem);
  @media (max-width: ${mobileMaxWidth}) {
    width: 100%;
    margin-left: 0;
  }
`

export const Right = css`
  width: 30%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  right: 1rem;
  top: 6rem;
  max-height: CALC(100% - 6rem);
  position: absolute;
  @media (max-width: ${mobileMaxWidth}) {
    display: none;
  }
`
