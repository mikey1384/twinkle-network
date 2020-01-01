import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import Definition from './Definition';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import { addEmoji } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';

Entry.propTypes = {
  entry: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function Entry({ entry, style }) {
  const [userDefinition, setUserDefinition] = useState('');
  const [definitionShown, setDefinitionShown] = useState(false);
  const { profileTheme } = useMyState();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            fontWeight: 'bold',
            fontSize: '3rem',
            alignItems: 'center'
          }}
        >
          {entry.content}
        </div>
        <div
          style={{
            lineHeight: '5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '3rem',
            marginLeft: '2rem'
          }}
        >
          <ProfilePic
            style={{ width: '2rem', height: '2rem' }}
            userId={entry.userId}
            profilePicId={entry.profilePicId}
          />
          <div style={{ marginLeft: '0.5rem' }}>{entry.username}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
        <Textarea
          autoFocus
          value={userDefinition}
          onChange={event => setUserDefinition(event.target.value)}
          onKeyUp={handleKeyUp}
          minRows={1}
          placeholder="What does this word mean?"
        />
        <Button
          filled
          color={profileTheme}
          style={{ marginLeft: '1rem', fontSize: '1.3rem', width: '16rem' }}
          onClick={() => setDefinitionShown(true)}
        >{`Show meaning`}</Button>
      </div>
      {definitionShown && <Definition wordObj={entry} />}
    </div>
  );

  function handleKeyUp(event) {
    if (event.key === ' ') {
      setUserDefinition(addEmoji(event.target.value));
    }
  }
}