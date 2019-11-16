import React, { useEffect, useState } from 'react';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import AccountTypeModal from './Modals/AccountTypeModal';
import ErrorBoundary from 'components/ErrorBoundary';
import Table from './Table';
import { useMyState } from 'helpers/hooks';
import { timeSince } from 'helpers/timeStampHelpers';
import { useAppContext, useManagementContext } from 'contexts';

export default function Main() {
  const { userId } = useMyState();
  const {
    requestHelpers: { loadModerators }
  } = useAppContext();
  const {
    state: { accountTypesLoaded, moderators, moderatorsLoaded },
    actions: { onLoadModerators }
  } = useManagementContext();
  const [accountTypeModalTarget, setAccountTypeModalTarget] = useState(null);
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
        <Table columns="1fr 1fr 2fr 1fr 2fr">
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
                  <a onClick={() => setAccountTypeModalTarget(moderator)}>
                    Change Account Type
                  </a>
                </td>
                {accountTypeModalTarget && (
                  <AccountTypeModal
                    target={accountTypeModalTarget}
                    onHide={() => setAccountTypeModalTarget(null)}
                  />
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionPanel>
      <SectionPanel
        title="Account Types"
        emptyMessage="No Account Types"
        loaded={accountTypesLoaded}
        button={
          <Button
            color="darkerGray"
            skeuomorphic
            onClick={() => console.log('clicked')}
          >
            + Add Account Type
          </Button>
        }
      >
        <Table
          headerFontSize="1.2rem"
          columns="1fr 1fr 1.1fr 1.2fr 1.1fr 1.7fr 1.7fr 2.1fr 1.3fr"
        >
          <thead>
            <tr>
              <th>Rank</th>
              <th>Auth</th>
              <th>Can Edit</th>
              <th>Can Delete</th>
              <th>Can Star</th>
              <th>Can Pin Playlists</th>
              <th>Can Edit Playlists</th>
              <th>Can Edit Reward Level</th>
              <th>Management</th>
            </tr>
          </thead>
        </Table>
      </SectionPanel>
    </ErrorBoundary>
  );
}
