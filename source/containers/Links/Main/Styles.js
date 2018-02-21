import { css } from 'emotion'
import { mobileMaxWidth } from 'constants/css'

export const container = css`
  width: 100%;
  @media (max-width: ${mobileMaxWidth}) {
    display: flex;
  }
  .left {
    width: CALC(70% - 3rem);
    margin-left: 1rem;
    @media (max-width: ${mobileMaxWidth}) {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
    }
  }
  .right {
    width: 30%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    right: 1rem;
    top: 5.5rem;
    bottom: 0;
    position: absolute;
    @media (max-width: ${mobileMaxWidth}) {
      display: none;
    }
  }
`
