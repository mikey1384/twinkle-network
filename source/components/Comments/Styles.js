import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

export const commentContainer = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 1.5rem;
  position: relative;
  font-size: 1.6rem;
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
    font-size: 1.8rem;
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
    color: ${Color.darkerGray()};
  }
  .comment__buttons {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }
  @media (max-width: ${mobileMaxWidth}) {
    .likes {
      font-size: 1.8rem;
      margin-top: 0.5rem;
      font-weight: bold;
      color: ${Color.darkerGray()};
    }
  }
`;
