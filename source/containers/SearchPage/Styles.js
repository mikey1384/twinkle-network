import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

export const searchPage = css`
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  width: 100%;
  height: CALC(100vh - 6rem);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  @media (max-width: ${mobileMaxWidth}) {
    margin-top: 0;
    padding-top: 0;
    padding-bottom: 9rem;
  }
`;
