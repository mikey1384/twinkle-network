import { css } from 'react-emotion'
import { Color, borderRadius, mobileMaxWidth } from 'constants/css'

export const PanelStyle = css`
  background: #fff;
  border-radius: ${borderRadius};
  border: 1px solid ${Color.borderGray()};
  margin-bottom: 2rem;
  padding: 1.5rem 2.5rem;
  small {
    font-size: 1.3rem;
    line-height: 3rem;
    color: ${Color.darkGray()};
  }
  p {
    font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, arial, verdana;
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
    .button-container {
      button {
        font-size: 3rem;
      }
    }
  }
`
