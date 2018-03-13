import { css } from 'react-emotion'
import { Color, borderRadius, mobileMaxWidth } from 'constants/css'

export const PanelStyle = css`
  background: #fff;
  border-radius: ${borderRadius};
  border: 1px solid ${Color.borderGray()};
  margin-bottom: 1rem;
  padding: 1.5rem 2rem;
  > p {
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
  }
`
