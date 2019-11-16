import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';

Table.propTypes = {
  children: PropTypes.node
};

export default function Table({ children }) {
  return (
    <table
      className={css`
        width: 100%;
        flex: 1;
        display: grid;
        border-collapse: collapse;
        grid-template-columns: 1fr 1fr 2fr 1fr 2fr;
        thead {
          display: contents;
        }
        tbody {
          display: contents;
        }
        tr {
          display: contents;
        }
        th {
          font-size: 1.7rem;
          font-weight: normal;
          text-align: left;
          padding: 1.5rem 2rem 1.5rem 2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: sticky;
          top: 0;
          background: ${Color.logoBlue()};
          color: white;
          position: relative;
        }
        th:last-child {
          border: 0;
        }
        td {
          font-size: 1.5rem;
          padding: 2rem;
          color: ${Color.darkGray()};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          a {
            cursor: pointer;
            display: none;
          }
        }
        tr:hover td {
          background: ${Color.lightPurple()};
          a {
            display: block;
          }
        }
      `}
    >
      {children}
    </table>
  );
}
