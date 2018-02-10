import styled from 'react-emotion'
import {Color} from 'constants/css'

export const Container = styled('div')`
  display: flex;
  border: 1px solid ${Color.borderGray};
  border-radius: 4px;
  flex-direction: column;
  width: 100%;
  background: #fff;
`

export const Heading = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: ${Color.headingGray};
  padding: 3%;
`
