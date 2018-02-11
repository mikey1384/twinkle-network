import { css } from 'react-emotion'

export const Left = css`
  width: CALC(70% - 3rem);
  margin-left: 1rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`

export const Right = css`
  position: absolute;
  right: 1rem;
  top: 65px;
  bottom: 0;
  width: 30%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`
