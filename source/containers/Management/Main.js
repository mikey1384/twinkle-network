import React from 'react';
import SectionPanel from 'components/SectionPanel';
import { css } from 'emotion';
import { Color } from 'constants/css';

export default function Main() {
  return (
    <SectionPanel title="Moderators" emptyMessage="No Moderators" loaded>
      <table
        className={css`
          width: 100%;
          flex: 1;
          display: grid;
          border-collapse: collapse;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          thead {
            display: contents;
          }
          tbody {
            display: contents;
          }
          tr {
            display: contents;
          }
          td {
            padding: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          th {
            font-size: 2rem;
            font-weight: normal;
            text-align: left;
            padding: 15px;
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
            padding-top: 10px;
            padding-bottom: 10px;
            color: #808080;
          }
          tr:nth-child(even) td {
            background: #f8f6ff;
          }
        `}
      >
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Last online</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>mikey</td>
            <td>admin</td>
            <td>yesterday</td>
            <td>mikey1384@gmail.com</td>
          </tr>
          <tr>
            <td>DytroCodes</td>
            <td>programmer</td>
            <td>10 minutes ago</td>
            <td>dytro@gmail.com</td>
          </tr>
        </tbody>
      </table>
    </SectionPanel>
  );
}
