import React from 'react';
import SectionPanel from 'components/SectionPanel';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import { useMyState } from 'helpers/hooks';

export default function ModifyUsername() {
  const { profileTheme } = useMyState();
  return (
    <SectionPanel title="Modify Username" emptyMessage="No Data" loaded>
      <div>
        <Input placeholder="Old Username" />
        <Input
          style={{
            marginTop: '1.2rem'
          }}
          placeholder="New Username"
        />
        <Button
          style={{
            marginTop: '1.2rem'
          }}
          color={profileTheme}
        >
          Modify Username
        </Button>
      </div>
    </SectionPanel>
  );
}
