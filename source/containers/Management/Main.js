import React, { useEffect } from 'react';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { timeSince } from 'helpers/timeStampHelpers';
import { useAppContext, useManagementContext } from 'contexts';

export default function Main() {
  const { userId } = useMyState();
  const {
    requestHelpers: { loadModerators }
  } = useAppContext();
  const {
    state: { moderators, moderatorsLoaded },
    actions: { onLoadModerators }
  } = useManagementContext();
  useEffect(() => {
    init();
    async function init() {
      const data = await loadModerators();
      onLoadModerators(data);
    }
  }, []);
  return (
    <ErrorBoundary>
      <SectionPanel
        title="Moderators"
        emptyMessage="No Moderators"
        loaded={moderatorsLoaded}
        button={
          <Button
            color="darkerGray"
            skeuomorphic
            onClick={() => console.log('clicked')}
          >
            + Add Moderator
          </Button>
        }
      >
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
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Email</th>
              <th>Online</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {moderators.map(moderator => (
              <tr key={moderator.id}>
                <td>{moderator.username}</td>
                <td
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {moderator.userType}
                </td>
                <td>{moderator.email}</td>
                <td>
                  {userId === moderator.id || moderator.online
                    ? 'now'
                    : timeSince(moderator.lastActive)}
                </td>
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  <a>Change Account Type</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionPanel>
    </ErrorBoundary>
  );
}
