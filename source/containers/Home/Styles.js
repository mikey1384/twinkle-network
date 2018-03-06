import { css } from 'react-emotion'
import { borderRadius, mobileMaxWidth } from 'constants/css'

export const container = css`
  width: 100%;
  height: 100%;
  @media (max-width: 991px) {
    display: flex;
  }
`

export const Left = css`
  position: absolute;
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

export const profilePanel = css`
  border: #e7e7e7 1px solid;
  display: flex;
  width: 100%;
  background: #fff;
  margin-bottom: 1rem;
  padding: 2rem;
  border-radius: ${borderRadius};
  line-height: 2.3rem;
  font-size: 1.5rem;
  position: relative;
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`
