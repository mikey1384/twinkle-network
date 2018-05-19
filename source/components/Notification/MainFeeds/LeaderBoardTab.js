import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import request from 'axios'
import UsernameText from 'components/Texts/UsernameText'
import ProfilePic from 'components/ProfilePic'
import { addCommasToNumber } from 'helpers/stringHelpers'
import { Color } from 'constants/css'
import { URL } from 'constants/URL'

const API_URL = `${URL}/user`

export default class LeaderBoardTab extends Component {
  static propTypes = {
    myId: PropTypes.number
  }

  state = {
    users: []
  }

  mounted = false

  async componentDidMount() {
    this.mounted = true
    try {
      const { data: users } = await request.get(`${API_URL}/leaderBoard`)
      if (this.mounted) {
        this.setState(() => ({ users }))
      }
    } catch (error) {
      console.error(error.response || error)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { myId } = this.props
    const { users } = this.state
    return (
      <Fragment>
        {users.length === 0 && <Loading />}
        {users.map(user => {
          const rank = !user.twinkleXP
            ? undefined
            : users.filter(otherUser => otherUser.twinkleXP > user.twinkleXP)
                .length + 1
          const rankColor =
            rank === 1
              ? Color.gold()
              : rank === 2
                ? Color.silver()
                : rank === 3
                  ? Color.orange()
                  : undefined
          return (
            <li
              key={user.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    width: '3rem',
                    marginRight: '1rem',
                    textAlign: 'center',
                    color:
                      rankColor ||
                      (rank <= 10 ? Color.logoBlue() : Color.buttonGray())
                  }}
                >
                  {rank ? `#${rank}` : '--'}
                </span>
                <ProfilePic
                  style={{ width: '6rem', height: '6rem' }}
                  profilePicId={user.profilePicId}
                  userId={user.id}
                />
                <div style={{ marginLeft: '1rem' }}>
                  <UsernameText
                    color={
                      rankColor ||
                      (rank <= 10 ? Color.logoBlue() : Color.buttonGray())
                    }
                    user={{ ...user, name: user.username }}
                    userId={myId}
                  />
                </div>
              </div>
              <div style={{ fontWeight: 'bold' }}>
                <span style={{ color: Color.logoGreen() }}>
                  {addCommasToNumber(user.twinkleXP || 0)}
                </span>{' '}
                <span style={{ color: Color.gold() }}>XP</span>
              </div>
            </li>
          )
        })}
      </Fragment>
    )
  }
}
