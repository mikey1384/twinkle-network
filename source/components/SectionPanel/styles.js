import { css } from 'emotion'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'

export const sectionPanel = css`
  border: 1px solid ${Color.borderGray};
  width: 100%;
  background: #fff;
  border-radius: ${borderRadius};
  margin-bottom: 1rem;
  .header {
    display: grid;
    grid-template-areas: "title search buttons";
    grid-template-columns: "fr fr fr";
    background: ${Color.logoBlue};
    color: #fff;
    border-top-left-radius: ${borderRadius};
    border-top-right-radius: ${borderRadius};
    padding: 1rem;
    font-size: 2.5rem;
    align-items: center;
    margin-bottom: 1rem;
  }
  .body {
    padding: 1rem;
  }
  @media (max-width: ${mobileMaxWidth}) {
    border-radius: 0;
    border: 0;
    .header {
      border-radius: 0;
    }
  }
`
