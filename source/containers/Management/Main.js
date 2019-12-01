import React, { useEffect, useState } from 'react';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import EditAccountTypeModal from './Modals/EditAccountTypeModal';
import EditModeratorModal from './Modals/EditModeratorModal';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import Table from './Table';
import { Color } from 'constants/css';
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
  const [moderatorModalTarget, setModeratorModalTarget] = useState(null);
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
        <Table columns="1fr 2fr 1fr 1fr 2fr">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Online</th>
              <th>Account Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {moderators.map(moderator => (
              <tr
                key={moderator.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setModeratorModalTarget(moderator)}
              >
                <td style={{ fontWeight: 'bold' }}>{moderator.username}</td>
                <td>{moderator.email}</td>
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
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  <a>Change Account Type</a>
                </td>
                {moderatorModalTarget && (
                  <EditModeratorModal
                    target={moderatorModalTarget}
                    onHide={() => setModeratorModalTarget(null)}
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
              <th style={{ textAlign: 'center' }}>Auth Level</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th style={{ textAlign: 'center' }}>Delete</th>
              <th style={{ textAlign: 'center' }}>Reward</th>
              <th style={{ textAlign: 'center' }}>Pin Playlists</th>
              <th style={{ textAlign: 'center' }}>Edit Playlists</th>
              <th style={{ textAlign: 'center' }}>Edit Reward Level</th>
            </tr>
          </thead>
          <tbody>
            {accountTypes.map(accountType => (
              <tr
                onClick={() => setAccountTypeModalTarget(accountType.label)}
                key={accountType.id}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ fontWeight: 'bold' }}>{accountType.label}</td>
                <td style={{ textAlign: 'center' }}>
                  {accountType.authLevel ? (
                    <Icon icon="check" style={{ color: Color.green() }} />
                  ) : (
                    <Icon icon="minus" />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {accountType.canEdit ? (
                    <Icon icon="check" style={{ color: Color.green() }} />
                  ) : (
                    <Icon icon="minus" />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {accountType.canDelete ? (
                    <Icon icon="check" style={{ color: Color.green() }} />
                  ) : (
                    <Icon icon="minus" />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {accountType.canStar ? (
                    <Icon icon="check" style={{ color: Color.green() }} />
                  ) : (
                    <Icon icon="minus" />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {accountType.canPinPlaylists ? (
                    <Icon icon="check" style={{ color: Color.green() }} />
                  ) : (
                    <Icon icon="minus" />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {accountType.canEditPlaylists ? (
                    <Icon icon="check" style={{ color: Color.green() }} />
                  ) : (
                    <Icon icon="minus" />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {accountType.canEditRewardLevel ? (
                    <Icon icon="check" style={{ color: Color.green() }} />
                  ) : (
                    <Icon icon="minus" />
                  )}
                </td>
              </tr>
            ))}
            {accountTypeModalTarget && (
              <EditAccountTypeModal
                target={accountTypeModalTarget}
                onHide={() => setAccountTypeModalTarget(null)}
              />
            )}
          </tbody>
        </Table>
      </SectionPanel>
    </ErrorBoundary>
  );
}
