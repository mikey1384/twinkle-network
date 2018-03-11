import React from 'react'
import PropTypes from 'prop-types'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'

FilterBar.propTypes = {
  children: PropTypes.node,
  bordered: PropTypes.bool,
  info: PropTypes.bool,
  success: PropTypes.bool
}
export default function FilterBar({ bordered, children, info, success }) {
  const color = {
    default: Color.blue(),
    success: Color.green(),
    info: Color.lightBlue()
  }
  let colorKey = 'default'
  if (info) colorKey = 'info'
  if (success) colorKey = 'success'
  return (
    <div
      className={css`
        background: #fff;
        height: 6rem;
        margin-bottom: 1rem;
        ${bordered
          ? `
        border-top: 1px solid ${Color.borderGray()};
        border-left: 1px solid ${Color.borderGray()};
        border-right: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        `
          : ''} display: flex;
        font-size: 1.7rem;
        width: 100%;
        align-items: center;
        justify-content: space-around;
        > nav {
          font-family: sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          border-bottom: 1px solid ${Color.borderGray()};
          > a {
            color: ${Color.menuGray()};
            text-decoration: none;
          }
        }
        > nav.active {
          border-bottom: 3px solid ${color[colorKey]};
          font-weight: bold;
          > a {
            color: ${color[colorKey]};
          }
          @media (max-width: ${mobileMaxWidth}) {
            border-bottom: 6px solid ${color[colorKey]};
          }
        }
        > nav:first-child {
          ${bordered
            ? 'border-bottom-left-radius: 5px;'
            : ''} @media (max-width: ${mobileMaxWidth}) {
            border-bottom-left-radius: 0;
          }
        }
        > nav:last-child {
          ${bordered
            ? 'border-bottom-right-radius: 5px;'
            : ''} @media (max-width: ${mobileMaxWidth}) {
            border-bottom-right-radius: 0;
          }
        }
        > nav:hover {
          transition: border-bottom 0.5s;
          border-bottom: 3px solid ${color[colorKey]};
          > a {
            color: ${color[colorKey]};
            transition: color 0.5s, font-weight 0.5s;
            font-weight: bold;
          }
        }
        @media (max-width: 991px) {
          font-size: 2.5vw;
          height: 8rem;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
        }
      `}
    >
      {children}
    </div>
  )
}
