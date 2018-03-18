import { css } from 'react-emotion'
import { Color, borderRadius, mobileMaxWidth } from 'constants/css'

export const container = css`
  background: #fff;
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid ${Color.borderGray()};
  border-radius: ${borderRadius};
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
  .heading {
    padding: 0.5rem 1.5rem 1rem 1.5rem;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 10rem;
  }
  .body {
    padding: 0;
    .panel__content {
      padding: 1rem;
      margin-top: 1rem;
      word-break: break-word;
      font-size: 1.6rem;
    }
    .bottom-interface {
      padding: 0 1rem 1rem 1rem;
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
  }
  .content-panel__likers {
    margin-top: 0.6rem;
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
  .timestamp {
    font-size: 1rem;
    color: ${Color.gray()};
  }
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    border-left: none;
    border-right: none;
    .heading {
      a,
      span {
        font-size: 2.0rem;
      }
      small {
        font-size: 1.5rem;
      }
    }
  }
`
