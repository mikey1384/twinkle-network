import React from 'react';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import FullTextReveal from 'components/Texts/FullTextReveal';
import Icon from 'components/Icon';

export default function ChannelDetails() {
  return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            width: '100%'
          }}
        >
          <div onClick={() => setChannelNameHovered(hovered => !hovered)}>
            <p
              ref={ChannelNameRef}
              style={{
                width: '100%',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                cursor: 'default'
              }}
              onMouseEnter={handleMouseOver}
              onMouseLeave={() => setChannelNameHovered(false)}
            >
              {customChannelNames[currentChannel.id] || channelName}
            </p>
            <FullTextReveal
              style={{ width: '100%', fontSize: '1.5rem' }}
              show={channelNameHovered}
              direction="left"
              text={channelName || ''}
            />
          </div>
          {displayedChannelMembers.length > 2 && (
            <div>
              {currentlyOnlineValidMembers.length}
              {currentChannel.id !== 2 &&
                '/' + displayedChannelMembers.length}{' '}
              online
            </div>
          )}
        </div>
      </div>
      <div>
        {displayedChannelMembers.map((member, index) => (
          <div
            key={`channel${currentChannel.id}member${member.id}`}
            style={{
              display: 'flex',
              width: '100%',
              padding: '1rem',
              paddingBottom:
                index === displayedChannelMembers.length - 1 ? '15rem' : '1rem'
            }}
          >
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ProfilePic
                style={{ height: '4rem', width: '4rem' }}
                userId={member.id}
                profilePicId={member.profilePicId}
                online={currentChannelOnlineMembers
                  .map(member => member.id)
                  .includes(member.id)}
                statusShown
              />
              <UsernameText
                truncate
                style={{
                  color: Color.darkerGray(),
                  marginLeft: '2rem'
                }}
                user={member}
              />
              {currentChannel.creatorId === member.id && (
                <div
                  style={{
                    marginLeft: '1rem'
                  }}
                >
                  <Icon icon="crown" style={{ color: Color.brownOrange() }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
  );
}
