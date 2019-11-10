import React from 'react';
import SettingsPanel from '../../components/Settings/SettingsPanel';
import { useMyState } from 'helpers/hooks';
import { Color } from 'constants/css';

export default function Settings() {
  const { profileTheme } = useMyState();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <SettingsPanel
        title="Username"
        customColorTheme={Color[profileTheme]()}
      />
    </div>
  );
}
