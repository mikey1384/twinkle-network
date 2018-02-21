import { css } from 'react-emotion'
import { mobileMaxWidth } from 'constants/css'

export const main = css`
  width: 100%;
  .left {
    width: CALC(70% - 3rem);
    margin-left: 1rem;
  }
  .right {
    width: 30%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    right: 1rem;
    top: 6.5rem;
    bottom: 0;
    position: absolute;
  }
  @media (max-width: ${mobileMaxWidth}) {
    display: flex;
    .left {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
    }
    .right {
      display: none;
    }
  }
`
