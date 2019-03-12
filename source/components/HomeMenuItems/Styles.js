import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

export const container = css`
  display: flex;
  font-size: 2rem;
  font-family: sans-serif, Arial, Helvetica;
  padding-left: 0;
  flex-direction: column;
  > nav {
    padding: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: ${Color.darkerGray()};
    justify-content: center;
    > a {
      margin-left: -2rem;
      text-align: center;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${Color.darkerGray()};
      text-decoration: none;
    }
    .homemenu__label {
      margin-left: 2rem;
    }
  }
  > nav:hover {
    color: ${Color.black()};
    font-weight: bold;
    a {
      color: ${Color.black()};
    }
  }
  > nav.active {
    background-color: #fff;
    font-weight: bold;
    color: ${Color.black()};
    a {
      color: ${Color.black()};
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
