import { css } from 'react-emotion'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'

export const container = css`
  display: flex;
  border: 1px solid ${Color.borderGray};
  border-radius: ${borderRadius};
  flex-direction: column;
  width: 100%;
  background: #fff;
  .heading {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    background: ${Color.headingGray};
    padding: 3%;
    .profile-pic {
      width: 40%;
      display: flex;
      justify-content: center;
    }
    .names {
      width: 60%;
      text-align: center;
      a {
        font-weight: bold;
        font-size: 2rem;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      span {
        color: ${Color.gray};
        font-size: 1rem;
      }
    }
  }
  .details {
    padding: 2rem;
  }
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    .heading {
      flex-direction: column;
      .profile-pic {
        width: 17%;
      }
      .names {
        text-align: center;
        a {
          font-size: 6rem;
        }
        span {
          font-size: 2.5rem;
        }
        width: 100%;
      }
    }
    .details {
      text-align: center;
      font-size: 3rem;
    }
  }
`
