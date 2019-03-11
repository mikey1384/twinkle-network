import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

export const siteContent = css`
  margin-top: 5rem;
  height: 100%;
  @media (max-width: ${mobileMaxWidth}) {
    margin-top: 0;
    padding-top: 0;
    padding-bottom: 9rem;
  }
`;
