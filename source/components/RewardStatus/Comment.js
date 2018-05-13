import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import UsernameText from 'components/Texts/UsernameText'
import { css } from 'emotion'
import { Color } from 'constants/css'
import LongText from 'components/Texts/LongText'
import DropdownButton from 'components/Buttons/DropdownButton'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'

Comment.propTypes = {
  myId: PropTypes.number,
  star: PropTypes.object.isRequired
}
export default function Comment({ myId, star }) {
  return (
    <ErrorBoundary>
      <div
        className={css`
          padding: 1rem;
          display: flex;
          align-items: space-between;
        `}
      >
        <div
          className={css`
            width: 6rem;
          `}
        >
          <ProfilePic
            userId={star.rewarderId}
            profilePicId={star.rewarderProfilePicId}
            style={{ width: '5rem', height: '5rem' }}
          />
        </div>
        <div
          className={css`
            width: 100%;
            margin-left: 0.5rem;
            font-size: 1.4rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          `}
        >
          <div>
            <div style={{ width: '100%' }}>
              <UsernameText
                user={{
                  id: star.rewarderId,
                  name: star.rewarderUsername
                }}
                userId={myId}
              />{' '}
              <span
                style={{
                  fontWeight: 'bold',
                  color: star.rewardAmount === 2 ? Color.gold() : Color.orange()
                }}
              >
                rewarded {star.rewardAmount === 1 ? 'a' : star.rewardAmount}{' '}
                Star{star.rewardAmount > 1 ? 's' : ''}
              </span>
            </div>
            <LongText>{star.rewardComment}</LongText>
          </div>
          <DropdownButton
            snow
            direction="left"
            menuProps={[
              { label: 'Edit', onClick: () => console.log('clicked') }
            ]}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
