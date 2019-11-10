import React from 'react';
import ManagementPanel from '../../components/ManagementPanel';
import { useMyState } from 'helpers/hooks';
import { Color } from 'constants/css';

export default function Management() {
  const { profileTheme } = useMyState();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <ManagementPanel
        title="Username"
        customColorTheme={Color[profileTheme]()}
      />
    </div>
  );
}
