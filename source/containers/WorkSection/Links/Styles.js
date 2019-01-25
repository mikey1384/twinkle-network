import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

export const container = css`
  width: 100%;
  @media (max-width: ${mobileMaxWidth}) {
    margin-top: 0;
    display: flex;
  }
  .left {
    margin-top: 1rem;
    width: CALC(73vw - 2rem);
    margin-left: 1rem;
    @media (max-width: ${mobileMaxWidth}) {
      margin-top: 0;
      width: 100%;
      margin-left: 0;
      margin-right: 0;
    }
  }
  .right {
    width: CALC(27vw - 1rem);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    right: 1rem;
    top: 6rem;
    bottom: 0;
    position: absolute;
    @media (max-width: ${mobileMaxWidth}) {
      display: none;
    }
  }
`;
