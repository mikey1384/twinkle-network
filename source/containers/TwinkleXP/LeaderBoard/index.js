import React, { Component } from 'react'
import Styles from '../Styles'
import { Color } from 'constants/css'
import Loading from 'components/Loading'
import LeaderBoardItem from './LeaderBoardItem'
import request from 'axios'
import { URL } from 'constants/URL'

const API_URL = `${URL}/user`
export default class LeaderBoard extends Component {
  state = {
    users: []
  }

  async componentDidMount() {
    try {
      const { data: users } = await request.get(`${API_URL}/leaderBoard`)
      this.setState(() => ({ users }))
    } catch (error) {
      console.error(error.response || error)
    }
  }

  render() {
    const { users } = this.state
    return (
      <div className="col-xs-offset-8" style={Styles.rightMenu}>
        <div style={{ ...Styles.subHeader, textAlign: 'center' }}>
          <span style={{ color: Color.logoGreen }}>Top</span>
          &nbsp;<span style={{ color: Color.logoBlue }}>30</span>
          &nbsp;<span style={{ color: Color.orange }}>Leaderboard</span>
        </div>
        {users.length === 0 && <Loading />}
        {users.length > 0 &&
          users.map(user => <LeaderBoardItem key={user.id} user={user} />)}
      </div>
    )
  }
}
