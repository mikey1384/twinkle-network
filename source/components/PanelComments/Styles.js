import { css } from 'emotion'
import { Color, mobileMaxWidth } from 'constants/css'

export const container = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 1.5rem;
  position: relative;
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
    section {
      width: 100%;
      margin-left: 2%;
    }
  }
  .timestamp {
    color: ${Color.gray};
  }
  .to {
    color: ${Color.blue};
  }
  .username {
    font-size: 1.7rem;
  }
  .content {
    wordbreak: break-word;
    margin: 0.5rem 0 1rem 0;
  }
  .reply-button {
    margin-left: 0.5rem;
  }
  .likers {
    font-size: 1.2rem;
    margin-top: 0.5rem;
    font-weight: bold;
    color: ${Color.green};
  }
  @media (max-width: ${mobileMaxWidth}) {
    .likers {
      font-size: 1.7rem;
      margin-top: 0.5rem;
      font-weight: bold;
      color: ${Color.green};
    }
  }
`
