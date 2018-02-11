import { css } from 'react-emotion'

export const Container = css`
  width: 100%;
  @media (max-width: 991px) {
    display: flex;
  }
`

export const Left = css`
  width: CALC(70% - 3rem);
  margin-left: 1rem;
  @media (max-width: 991px) {
    width: 70%;
    margin-right: 1rem;
  }
`

export const Right = css`
  width: 30%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  @media (max-width: 991px) {
    position: relative;
  }
  @media (min-width: 992px) {
    right: 1rem;
    top: 65px;
    bottom: 0;
    position: absolute;
  }
`
