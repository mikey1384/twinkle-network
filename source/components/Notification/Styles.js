import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

export const container = css`
  padding-top: 1rem;
  font-size: 1.5rem;
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    > section {
      min-height: 0;
    }
  }
`;

export const notiFeedListItem = css`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
  > small {
    color: ${Color.gray()};
  }
`;
