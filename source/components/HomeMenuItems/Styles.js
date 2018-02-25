import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  display: flex;
  font-size: 2rem;
  font-family: 'Helvetica Neue';
  padding-left: 0;
  flex-direction: column;
  nav {
    padding: 1.5rem;
    cursor: pointer;
    display: flex;
    padding-left: 2rem;
    align-items: center;
    color: #7c7c7c;
    .icon {
      text-align: center;
      margin-right: 1rem;
    }
    a {
      color: #7c7c7c;
      text-decoration: none;
      img {
        width: 4rem;
        height: 4rem;
      }
    }
    a:nth-child(2) {
      margin-left: 1rem;
    }
  }
  nav:hover {
    color: #333333;
    a {
      color: #333333;
    }
  }
  nav.active {
    background-color: #fff;
    font-weight: bold;
    color: #333333;
    a {
      color: #333333;
    }
  }
  @media (max-width: ${mobileMaxWidth}) {
    font-size: 5rem;
    padding: 2rem 0;
    background: #fff;
    nav {
      padding: 2rem 0;
      justify-content: center;
      .item-icon {
        width: auto;
        text-align: left;
        margin-left: -2rem;
      }
      .item-name {
        margin-left: 4rem;
        width: auto;
        text-align: left;
      }
      a {
        img {
          width: 8rem;
          height: 8rem;
        }
      }
    }
  }
`
