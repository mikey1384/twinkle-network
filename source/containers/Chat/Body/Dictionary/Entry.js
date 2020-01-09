import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import Definition from './Definition';
import Textarea from 'components/Texts/Textarea';
import FilterBar from 'components/FilterBar';
import { addEmoji } from 'helpers/stringHelpers';

Entry.propTypes = {
  entry: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function Entry({ entry, style }) {
  const [commentInput, setCommentInput] = useState('');
  const [selectedTab, setSelectedTab] = useState('comments');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
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
      <FilterBar
        color="vantaBlack"
        style={{ fontSize: '1.5rem', height: '4rem' }}
      >
        <nav
          className={selectedTab === 'comments' ? 'active' : ''}
          onClick={() => setSelectedTab('comments')}
        >
          Comments
        </nav>
        <nav
          className={selectedTab === 'dictionary' ? 'active' : ''}
          onClick={() => setSelectedTab('dictionary')}
        >
          Dictionary
        </nav>
      </FilterBar>
      {selectedTab === 'dictionary' && <Definition wordObj={entry} />}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
        <Textarea
          autoFocus
          value={commentInput}
          onChange={event => setCommentInput(event.target.value)}
          onKeyUp={handleKeyUp}
          minRows={1}
          placeholder={`Talk about "${entry.content}"`}
        />
      </div>
    </div>
  );

  function handleKeyUp(event) {
    if (event.key === ' ') {
      setCommentInput(addEmoji(event.target.value));
    }
  }
}
