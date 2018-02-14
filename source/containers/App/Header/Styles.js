import { css } from 'react-emotion'

export const Container = css`
  display: flex;
  z-index: 100;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 0px;
  @media (min-width: 992px) {
    top: 0;
  }
  @media (max-width: 991px) {
    bottom: 0;
  }
`

export const MainTabs = css`
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 991px) {
    padding: 0;
    width: 100%;
  }
`
