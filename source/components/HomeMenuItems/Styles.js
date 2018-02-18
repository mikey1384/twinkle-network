import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  display: flex;
  font-size: 2rem;
  padding-left: 0;
  flex-direction: column;
  nav {
    padding: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    a {
      text-decoration: none;
      color: #7c7c7c;
      img {
        width: 4rem;
        height: 4rem;
      }
    }
    a:nth-child(2) {
      margin-left: 1rem;
    }
    .item-icon {
      width: 20%;
    }
    .item-name {
      width: 80%;
      text-align: center;
    }
  }
  nav:hover {
    a {
      color: #333333;
    }
  }
  nav.active {
    background-color: #fff;
    font-weight: bold;
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
