import { css } from 'react-emotion';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';

export const PanelStyle = css`
  background: #fff;
  border-radius: ${borderRadius};
  border: 1px solid ${Color.borderGray()};
  margin-bottom: 1rem;
  padding: 1.5rem 2rem;
  small {
    font-size: 1.3rem;
    line-height: 2.5rem;
  }
  > p {
    font-family: sans-serif, verdana;
    color: ${Color.darkGray()};
    margin-bottom: 1rem;
    font-size: 2rem;
    font-weight: bold;
  }
  .button-container {
    display: flex;
    flex-direction: row-reverse;
  }
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;
