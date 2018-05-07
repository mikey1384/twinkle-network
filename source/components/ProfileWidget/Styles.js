import { css } from 'react-emotion'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'

export const container = css`
  display: flex;
  border: none;
  flex-direction: column;
  width: 100%;
  z-index: 1000;
  a {
    text-decoration: none;
  }
  .heading {
    padding: 1rem;
    border: 1px solid ${Color.borderGray};
    border-bottom: none;
    border-radius: ${borderRadius};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    display: flex;
    background: ${Color.headingGray()};
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    .names {
      width: 60%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      a {
        color: ${Color.blue()};
        font-weight: bold;
        font-size: 2rem;
      }
      span {
        color: ${Color.darkGray()};
        font-size: 1rem;
      }
    }
  }
  .widget__profile-pic {
    width: 8rem;
    height: 8rem;
  }
  .details {
    font-size: 1.3rem;
    border: 1px solid ${Color.borderGray()};
    border-bottom-left-radius: ${borderRadius};
    border-bottom-right-radius: ${borderRadius};
    background: #fff;
    padding: 1.5rem;
    .login-message {
      font-size: 2rem;
      color: ${Color.darkGray()};
      font-weight: bold;
    }
  }
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    .heading {
      flex-direction: column;
      .names {
        text-align: center;
        a {
          font-size: 4rem;
        }
        span {
          font-size: 1.5rem;
        }
        width: 100%;
      }
    }
    .details {
      text-align: center;
      font-size: 3rem;
      .login-message {
        font-size: 3rem;
      }
      button {
        font-size: 3rem;
      }
    }
  }
`
