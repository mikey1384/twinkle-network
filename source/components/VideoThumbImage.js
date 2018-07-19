import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StarMark from 'components/StarMark'
import { URL } from 'constants/URL'
import { auth } from 'helpers/requestHelpers'
import request from 'axios'
import { connect } from 'react-redux'
import { Color } from 'constants/css'

const API_URL = `${URL}/video`

class VideoThumbImage extends Component {
  static propTypes = {
    height: PropTypes.string,
    isStarred: PropTypes.bool,
    src: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }

  state = {
    xpEarned: false
  }

  mounted = false

  componentDidMount() {
    const { userId, isStarred } = this.props
    this.mounted = true
    if (isStarred && userId) {
      this.checkXpStatus()
    }
  }

  componentDidUpdate(prevProps) {
    const { videoId, isStarred, userId } = this.props
    const isNewVideo = prevProps.videoId !== videoId
    const isDifferentUser = userId && userId !== prevProps.userId
    const isUnstarred = prevProps.isStarred && !isStarred
    const isLoggedOut = prevProps.userId && !userId
    if (isStarred) {
      if (isNewVideo || isDifferentUser) {
        this.checkXpStatus()
      }
    }
    if (isUnstarred || isLoggedOut) {
      this.setState({ xpEarned: false })
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { src, height = '55%', isStarred } = this.props
    const { xpEarned } = this.state
    return (
      <div
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          overFlow: 'hidden',
          paddingBottom: height,
          position: 'relative'
        }}
      >
        <img
          alt="Thumbnail"
          src={src}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            margin: 'auto',
            borderBottom: !!xpEarned && `0.8rem solid ${Color.lightBlue}`
          }}
        />
        {isStarred && <StarMark style={{ top: 1, left: 1 }} size={3.5} />}
      </div>
    )
  }

  checkXpStatus = async() => {
    const { videoId } = this.props
    const authorization = auth()
    const authExists = !!authorization.headers.authorization
    if (authExists) {
      try {
        const {
          data: { xpEarned }
        } = await request.get(`${API_URL}/xpEarned?videoId=${videoId}`, auth())
        if (this.mounted) this.setState(() => ({ xpEarned }))
      } catch (error) {
        console.error(error.response || error)
      }
    }
  }
}

export default connect(state => ({ userId: state.UserReducer.userId }))(
  VideoThumbImage
)
