import { css } from 'react-emotion'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { desktopMinWidth } from '../../constants/css'

export const Container = css`
  width: 100%;
  @media (max-width: 991px) {
    display: flex;
  }
`

export const FilterBar = css`
  background: #fff;
  height: 6rem;
  margin-bottom: 2rem;
  border-top: 1px solid ${Color.borderGray};
  border-left: 1px solid ${Color.borderGray};
  border-right: 1px solid ${Color.borderGray};
  border-radius: ${borderRadius};
  display: flex;
  font-size: 1.5rem;
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
    border-bottom: 1px solid ${Color.borderGray};
    a {
      color: ${Color.menuGray};
      text-decoration: none;
    }
  }
  nav.active {
    border-bottom: 3px solid ${Color.blue};
    font-weight: bold;
    a {
      color: ${Color.blue};
    }
    @media (max-width: ${mobileMaxWidth}) {
      border-bottom: 6px solid ${Color.blue};
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
    border-bottom: 3px solid ${Color.blue};
    a {
      color: ${Color.blue};
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
  section {
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
  @media (max-width: ${mobileMaxWidth}) {
    display: none;
  }
  @media (min-width: ${desktopMinWidth}) {
    right: 1rem;
    top: 65px;
    bottom: 0;
    position: absolute;
  }
`

export const MenuItems = css`
  margin-top: 2rem;
  display: flex;
  font-size: 2rem;
  padding-left: 0;
  flex-direction: column;
  li {
    padding: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    a {
      text-decoration: none;
      color: #7c7c7c;
      img {
        width: 3vw;
        height: 3vw;
      }
    }
    a:nth-child(2) {
      margin-left: 1rem;
    }
  }
  li:hover {
    a {
      color: #333333;
    }
  }
  li.active {
    background-color: #fff;
    font-weight: bold;
    a {
      color: #333333;
    }
  }
`

export const TwinkleXP = css`
  margin-bottom: 0px;
  text-align: center;
  padding: 1rem;
  background: #fff;
  border: 1px solid #eeeeee;
  borderradius: 5px;
  p {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 0px;
  }
  a {
    font-size: 1.5rem;
    font-weight: bold;
  }
`
