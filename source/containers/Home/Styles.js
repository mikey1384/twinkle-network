import { css } from 'react-emotion'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { desktopMinWidth } from '../../constants/css'

export const container = css`
  width: 100%;
  height: 100%;
  @media (max-width: 991px) {
    display: flex;
  }
`

export const FilterBar = css`
  background: #fff;
  height: 6rem;
  margin-bottom: 2rem;
  border-top: 1px solid ${Color.borderGray()};
  border-left: 1px solid ${Color.borderGray()};
  border-right: 1px solid ${Color.borderGray()};
  border-radius: ${borderRadius};
  display: flex;
  font-size: 1.7rem;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  nav {
    font-family: sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    border-bottom: 1px solid ${Color.borderGray()};
    a {
      color: ${Color.menuGray};
      text-decoration: none;
    }
  }
  nav.active {
    border-bottom: 3px solid ${Color.blue()};
    font-weight: bold;
    a {
      color: ${Color.blue};
    }
    @media (max-width: ${mobileMaxWidth}) {
      border-bottom: 6px solid ${Color.blue()};
    }
  }
  nav:first-child {
    border-bottom-left-radius: 5px;
    @media (max-width: ${mobileMaxWidth}) {
      border-bottom-left-radius: 0;
    }
  }
  nav:last-child {
    border-bottom-right-radius: 5px;
    @media (max-width: ${mobileMaxWidth}) {
      border-bottom-right-radius: 0;
    }
  }
  nav:hover {
    transition: border-bottom 0.5s;
    border-bottom: 3px solid ${Color.blue()};
    a {
      color: ${Color.blue()};
      transition: color 0.5s, font-weight 0.5s;
      font-weight: bold;
    }
  }
  @media (max-width: 991px) {
    font-size: 2.5vw;
    height: 8rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
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
  top: 7rem;
  max-height: CALC(100% - 8rem);
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
