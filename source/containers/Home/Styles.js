import { css } from 'react-emotion'

export const Container = css`
  width: 100%;
`

export const Left = css`
  position: absolute;
  left: 1rem;
  @media (max-width: 991px) {
    display: none;
  }
  @media (min-width: 992px) {
    display: block;
    width: 15%;
  }
`

export const Center = css`
  width: 100%;
  section {
    margin-left: calc(15% + 5rem);
    @media (max-width: 991px) {
      width: CALC(70% - 3rem);
      margin-left: 1rem;
    }
    @media (min-width: 992px) {
      display: block;
      width: CALC(55% - 10rem);
    }
  }
`

export const Right = css`
  position: absolute;
  right: 1rem;
  top: 65px;
  bottom: 0;
  width: 30%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
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
    background-color: #fbfbfb;
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
