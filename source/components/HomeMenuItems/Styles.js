import { css } from 'react-emotion';
import { mobileMaxWidth } from 'constants/css';

export const container = css`
  display: flex;
  font-size: 2rem;
  font-family: sans-serif, verdana;
  padding-left: 0;
  flex-direction: column;
  > nav {
    padding: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #7c7c7c;
    justify-content: center;
    > a {
      padding-left: 1rem;
      text-align: center;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #7c7c7c;
      text-decoration: none;
    }
    .homemenu__label {
      margin-left: 2rem;
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
      a {
        justify-content: center;
        padding: 0;
      }
      .homemenu__label {
        margin-left: 10%;
      }
    }
  }
`;
