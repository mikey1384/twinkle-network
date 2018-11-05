import { css } from 'react-emotion';
import { mobileMaxWidth } from 'constants/css';

export const main = css`
  width: 100%;
  .left {
    width: CALC(73vw - 2rem);
    margin-top: 1rem;
    margin-left: 1rem;
  }
  .right {
    width: CALC(27vw - 1rem);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    right: 1rem;
    top: 6rem;
    bottom: 0;
    position: absolute;
  }
  @media (max-width: ${mobileMaxWidth}) {
    display: flex;
    .left {
      width: 100%;
      margin-top: 0;
      margin-left: 0;
      margin-right: 0;
    }
    .right {
      display: none;
    }
  }
`;
