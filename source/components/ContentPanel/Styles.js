import { css } from 'react-emotion'
import { Color, borderRadius, mobileMaxWidth } from 'constants/css'

export const container = css`
  background: #fff;
  width: 100%;
  margin-bottom: 1.5rem;
  border: 1px solid ${Color.borderGray()};
  border-radius: ${borderRadius};
  .heading {
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    width: 100%;
    span,
    a {
      line-height: 2.5rem;
    }
  }
  .body {
    .content {
      margin-top: 1rem;
      padding: 1rem;
      word-break: break-word;
      font-size: 1.6rem;
      line-height: 2.5rem;
    }
    .bottom-interface {
      display: flex;
      flex-direction: column;
      .buttons-bar {
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
        }
        .right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }
    }
    padding: 1rem 1.5rem 1rem 1.5rem;
  }
  .likers {
    margin-top: 0.5rem;
    font-weight: bold;
    color: ${Color.darkGray()};
    font-size: 1.2rem;
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
    color: ${Color.gray()};
  }
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    border-left: none;
    border-right: none;
    .body {
      font-size: 2rem;
    }
    .likers {
      font-size: 1.7rem;
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
