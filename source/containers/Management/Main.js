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
    requestHelpers: { loadAccountTypes, loadModerators }
  } = useAppContext();
  const {
    state: { accountTypes, accountTypesLoaded, moderators, moderatorsLoaded },
    actions: { onLoadAccountTypes, onLoadModerators }
  } = useManagementContext();
  const [accountTypeModalTarget, setAccountTypeModalTarget] = useState(null);
  useEffect(() => {
    initModerators();
    initAccountTypes();
    async function initModerators() {
      const data = await loadModerators();
      onLoadModerators(data);
    }
    async function initAccountTypes() {
      const data = await loadAccountTypes();
      onLoadAccountTypes(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          headerFontSize="1.5rem"
          columns="1.2fr 1.5fr 1fr 1.2fr 1.1fr 1.6fr 1.6fr 2fr"
        >
          <thead>
            <tr>
              <th>Label</th>
              <th>Auth Level</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Reward</th>
              <th>Pin Playlists</th>
              <th>Edit Playlists</th>
              <th>Edit Reward Level</th>
            </tr>
          </thead>
          <tbody>
            {accountTypes.map(accountType => (
              <tr key={accountType.id}>
                <td>{accountType.label}</td>
                <td>{accountType.authLevel}</td>
                <td>{accountType.canEdit}</td>
                <td>{accountType.canDelete}</td>
                <td>{accountType.canStar}</td>
                <td>{accountType.canPinPlaylists}</td>
                <td>{accountType.canEditPlaylists}</td>
                <td>{accountType.canEditRewardLevel}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionPanel>
    </ErrorBoundary>
  );
}
