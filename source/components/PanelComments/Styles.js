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
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
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
  .comment__likers {
    margin-top: 0.6rem;
    font-size: 1.2rem;
    line-height: normal;
    font-weight: bold;
    color: ${Color.darkGray()};
  }
  @media (max-width: ${mobileMaxWidth}) {
    .likers {
      font-size: 1.7rem;
      margin-top: 0.5rem;
      font-weight: bold;
      color: ${Color.darkGray()};
    }
  }
`
