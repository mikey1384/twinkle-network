import { css } from 'emotion'
import { Color, mobileMaxWidth } from 'constants/css'

export const container = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 1.5rem;
  position: relative;
  font-size: 1.5rem;
  .dropdown-wrapper {
    right: 0;
    position: absolute;
  }
  .content-wrapper {
    display: flex;
    width: 100%;
    position: relative;
    aside {
      width: 7rem;
      justify-content: center;
      display: flex;
    }
    section {
      width: 100%;
      margin-left: 1rem;
    }
  }
  .timestamp {
    color: ${Color.gray()};
    > a {
      color: ${Color.gray()};
    }
  }
  .to {
    color: ${Color.blue()};
    font-size: 1.3rem;
    line-height: 2.3rem;
    font-weight: bold;
  }
  .username {
    font-size: 1.7rem;
  }
  .comment__content {
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
    line-height: 2rem;
    padding: 1.5rem 0 2rem 0;
  }
  .reply-button {
    margin-left: 0.5rem;
  }
  .comment__likes {
    margin-top: 0.5rem;
    font-size: 1.2rem;
    line-height: 1.5;
    font-weight: bold;
    color: ${Color.darkGray()};
  }
  .comment__buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .buttons__left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 50%;
  }
  .buttons__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    width: 50%;
  }
  @media (max-width: ${mobileMaxWidth}) {
    .likes {
      font-size: 1.7rem;
      margin-top: 0.5rem;
      font-weight: bold;
      color: ${Color.darkGray()};
    }
  }
`
