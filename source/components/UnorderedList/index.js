import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { borderRadius, Color } from 'constants/css'
import { mobileMaxWidth } from '../../constants/css'

UnorderedList.propTypes = {
  children: PropTypes.node.isRequired
}
export default function UnorderedList({ children }) {
  const StyledList = styled('ul')`
    list-style: none;
    padding: 0;
    li {
      width: 100%;
      background: #fff;
      padding: 1.5rem;
      border-right: 1px solid ${Color.borderGray};
      border-left: 1px solid ${Color.borderGray};
      border-bottom: 1px solid ${Color.borderGray};
      @media (max-width: ${mobileMaxWidth}) {
        border-left: 0;
        border-right: 0;
      }
    }
    li:first-child {
      border-top-left-radius: ${borderRadius};
      border-top-right-radius: ${borderRadius};
      border-top: 1px solid ${Color.borderGray};
      border-bottom: 1px solid ${Color.borderGray};
      @media (max-width: ${mobileMaxWidth}) {
        border-radius: 0;
      }
    }
    li:last-child {
      border-bottom-left-radius: ${borderRadius};
      border-bottom-right-radius: ${borderRadius};
      border-top: none;
      border-bottom: 1px solid ${Color.borderGray};
      @media (max-width: ${mobileMaxWidth}) {
        border-radius: 0;
      }
    }
    @media (max-width: ${mobileMaxWidth}) {
      margin-top: 2rem;
    }
  `
  return <StyledList>{children}</StyledList>
}
