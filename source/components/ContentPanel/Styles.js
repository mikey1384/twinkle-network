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
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 10rem;
  }
  .body {
    padding: 0;
    .bottom-interface {
      padding: 0 1rem 0 1rem;
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
          justify-content: flex-start;
          align-items: center;
        }
      }
    }
  }
  .content-panel__likers {
    font-weight: bold;
    color: ${Color.darkGray()};
    font-size: 1.2rem;
  }
  .question {
    font-size: 2rem;
    font-weight: bold;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
    margin-bottom: 1.5rem;
  }
  .title {
    font-size: 1.7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
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
        font-size: 2rem;
      }
      small {
        font-size: 1.5rem;
      }
    }
  }
`
