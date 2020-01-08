import React, { useEffect, useMemo, useState } from 'react';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import EditAccountTypeModal from './Modals/EditAccountTypeModal';
import EditModeratorModal from './Modals/EditModeratorModal';
import AddModeratorModal from './Modals/AddModeratorModal';
import ErrorBoundary from 'components/ErrorBoundary';
import Table from './Table';
import Check from './Check';
import { useMyState } from 'helpers/hooks';
import { timeSince } from 'helpers/timeStampHelpers';
import { useAppContext, useManagementContext } from 'contexts';
import AddAccountTypeModal from './Modals/AddAccountTypeModal';

export default function Main() {
  const { userId, managementLevel } = useMyState();
  const canManage = useMemo(() => managementLevel > 1, [managementLevel]);
  const {
    requestHelpers: { loadAccountTypes, loadModerators }
  } = useAppContext();
  const {
    state: { accountTypes, accountTypesLoaded, moderators, moderatorsLoaded },
    actions: { onLoadAccountTypes, onLoadModerators }
  } = useManagementContext();
  const [accountTypeModalTarget, setAccountTypeModalTarget] = useState(null);
  const [moderatorModalTarget, setModeratorModalTarget] = useState(null);
  const [addAccountTypeModalShown, setAddAccountTypeModalShown] = useState(
    false
  );
  const [addModeratorModalShown, setAddModeratorModalShown] = useState(false);
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
        style={{ paddingLeft: 0, paddingRight: 0 }}
        button={
          canManage ? (
            <Button
              color="darkerGray"
              skeuomorphic
              onClick={() => setAddModeratorModalShown(true)}
            >
              + Add Moderators
            </Button>
          ) : null
        }
      >
        <Table
          columns={`
            minmax(10rem, 1fr)
            minmax(15rem, 2fr)
            minmax(10rem, 1fr)
            minmax(15rem, 1fr)
            ${canManage ? 'minmax(17rem, 2fr)' : ''}
          `}
        >
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Online</th>
              <th>Account Type</th>
              {canManage && <th></th>}
            </tr>
          </thead>
          <tbody>
            {moderators.map(moderator => (
              <tr
                key={moderator.id}
                style={{ cursor: canManage && 'pointer' }}
                onClick={() =>
                  canManage ? setModeratorModalTarget(moderator) : {}
                }
              >
                <td style={{ fontWeight: 'bold', fontSize: '1.6rem' }}>
                  {moderator.username}
                </td>
                <td>{moderator.email || 'Not Specified'}</td>
                <td>
                  {userId === moderator.id || moderator.online
                    ? 'now'
                    : timeSince(moderator.lastActive)}
                </td>
                <td
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {moderator.userType}
                </td>
                {canManage && (
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <a>Change Account Type</a>
                  </td>
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
        style={{ paddingLeft: 0, paddingRight: 0 }}
        button={
          canManage ? (
            <Button
              color="darkerGray"
              skeuomorphic
              onClick={() => setAddAccountTypeModalShown(true)}
            >
              + Add Account Type
            </Button>
          ) : null
        }
      >
        <Table
          headerFontSize="1.5rem"
          columns={`
            minmax(10rem, 1.5fr)
            minmax(15rem, 1.5fr)
            minmax(10rem, 1fr)
            minmax(10rem, 1.2fr)
            minmax(10rem, 1.1fr)
            minmax(17rem, 2fr)
            minmax(15rem, 1.6fr)
            minmax(17rem, 2fr)
          `}
        >
          <thead>
            <tr>
              <th>Label</th>
              <th style={{ textAlign: 'center' }}>Auth Level</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th style={{ textAlign: 'center' }}>Delete</th>
              <th style={{ textAlign: 'center' }}>Reward</th>
              <th style={{ textAlign: 'center' }}>Feature Contents</th>
              <th style={{ textAlign: 'center' }}>Edit Playlists</th>
              <th style={{ textAlign: 'center' }}>Edit Reward Level</th>
            </tr>
          </thead>
          <tbody>
            {accountTypes.map(accountType => (
              <tr
                onClick={() =>
                  canManage ? setAccountTypeModalTarget(accountType.label) : {}
                }
                key={accountType.label}
                style={{ cursor: canManage && 'pointer' }}
              >
                <td
                  style={{
                    fontWeight: 'bold',
                    fontSize: '1.6rem'
                  }}
                >
                  {accountType.label}
                </td>
                <td style={{ textAlign: 'center' }}>{accountType.authLevel}</td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canEdit} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canDelete} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canStar} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canPinPlaylists} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canEditPlaylists} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Check checked={!!accountType.canEditRewardLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionPanel>
      {moderatorModalTarget && (
        <EditModeratorModal
          accountTypes={accountTypes}
          target={moderatorModalTarget}
          onHide={() => setModeratorModalTarget(null)}
        />
      )}
      {accountTypeModalTarget && (
        <EditAccountTypeModal
          target={
            accountTypes.filter(
              accountType => accountType.label === accountTypeModalTarget
            )[0]
          }
          onHide={() => setAccountTypeModalTarget(null)}
        />
      )}
      {addModeratorModalShown && (
        <AddModeratorModal
          accountTypes={accountTypes}
          onHide={() => setAddModeratorModalShown(false)}
        />
      )}
      {addAccountTypeModalShown && (
        <AddAccountTypeModal
          onHide={() => setAddAccountTypeModalShown(false)}
        />
      )}
    </ErrorBoundary>
  );
}
