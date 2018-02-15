import { css } from 'react-emotion'
import { Color, borderRadius, mobileMaxWidth } from 'constants/css'

export const likers = css`
  margin-top: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${Color.green};
`

export const container = css`
  background: #fff;
  margin-bottom: 1.5rem;
  border: 1px solid ${Color.borderGray};
  border-radius: ${borderRadius};
  .heading {
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    width: 100%;
  }
  .body {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
  }
  .question {
    font-size: 2rem;
    font-weight: bold;
    word-break: break-word;
    margin-bottom: 1.5rem;
  }
  .title {
    font-size: 1.7rem;
  }
  .time-stamp {
    font-size: 1rem;
    color: ${Color.gray};
  }
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    border-left: none;
    border-right: none;
    .body {
      font-size: 2rem;
    }
    .question {
      font-size: 3rem;
    }
    header {
      .title {
        font-size: 2.5rem;
      }
      .time-stamp {
        font-size: 1.5rem;
      }
    }
    button {
      font-size: 2rem;
    }
  }
`
