import { css } from 'react-emotion'
import { borderRadius, Color } from 'constants/css'

export const Container = css`
  display: flex;
  border: 1px solid ${Color.borderGray};
  border-radius: ${borderRadius};
  flex-direction: column;
  width: 100%;
  background: #fff;
`

export const Heading = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: ${Color.headingGray};
  padding: 3%;
`

export const Names = css`
  width: 65%;
  text-align: center;
  a {
    font-weight: bold;
    font-size: 2rem;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  span {
    color: ${Color.gray};
    font-size: 1rem;
  }
`

export const Details = css`
  padding: 2rem;
`
