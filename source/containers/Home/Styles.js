import { css } from 'react-emotion'
import { borderRadius, mobileMaxWidth } from 'constants/css'
import { desktopMinWidth } from '../../constants/css'

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
  @media (max-width: ${mobileMaxWidth}) {
    display: none;
  }
  @media (min-width: ${desktopMinWidth}) {
    display: block;
    width: 15%;
  }
`

export const Center = css`
  width: 100%;
  height: 100%;
  section {
    height: 100%;
    margin-left: calc(15% + 5rem);
    @media (max-width: ${mobileMaxWidth}) {
      width: 100% - 2rem;
      margin-left: 0;
    }
    @media (min-width: ${desktopMinWidth}) {
      width: CALC(55% - 10rem);
    }
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
