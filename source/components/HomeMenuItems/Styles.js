import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  display: flex;
  font-size: 2rem;
  font-family: 'Helvetica Neue', Helvetica, 'Liberation Sans', Arial, sans-serif;
  padding-left: 0;
  flex-direction: column;
  > nav {
    padding: 1.5rem;
    cursor: pointer;
    display: flex;
    padding-left: 2rem;
    align-items: center;
    color: #7c7c7c;
    .icon {
      text-align: center;
      margin-right: 1rem;
      width: 3rem;
    }
    a {
      margin-left: 1rem;
      color: #7c7c7c;
      text-decoration: none;
    }
  }
  > nav:hover {
    color: #333333;
    a {
      color: #333333;
    }
  }
  > nav.active {
    background-color: #fff;
    font-weight: bold;
    color: #333333;
    a {
      color: #333333;
    }
  }
  @media (max-width: ${mobileMaxWidth}) {
    font-size: 3rem;
    padding: 1rem 0;
    background: #fff;
    > nav {
      padding: 1rem 0;
      justify-content: center;
      .icon {
        width: 10rem;
        text-align: center;
        margin-left: -3rem;
      }
    }
  }
`
