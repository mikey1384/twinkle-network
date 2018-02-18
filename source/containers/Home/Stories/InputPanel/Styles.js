import { css } from 'react-emotion'
import { Color, borderRadius, mobileMaxWidth } from 'constants/css'

export const PanelStyle = css`
  background: #fff;
  border-radius: ${borderRadius};
  border: 1px solid ${Color.borderGray};
  margin-bottom: 2rem;
  padding: 1.5rem 2.5rem;
  p {
    font-size: 2rem;
    font-weight: bold;
  }
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    border-left: none;
    border-right: none;
    p {
      font-size: 2.5rem;
    }
    small {
      font-size: 1.5rem;
    }
    input {
      height: 6rem;
      font-size: 2rem;
    }
    textarea {
      font-size: 2rem;
    }
    .mobile-button {
      display: flex;
      flex-direction: row-reverse;
      button {
        font-size: 3rem;
      }
    }
  }
`
