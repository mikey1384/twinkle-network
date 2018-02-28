import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StarMark from 'components/StarMark'
import { URL } from 'constants/URL'
import { auth } from 'redux/actions/constants'
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

  componentWillMount() {
    const { userId, isStarred } = this.props
    this.mounted = true
    if (isStarred && userId) {
      this.checkXpStatus()
    }
  }

  componentDidUpdate(prevProps) {
    const { videoId, isStarred } = this.props
    if (prevProps.videoId !== videoId) {
      if (!isStarred) return this.setState(() => ({ xpEarned: false }))
      this.checkXpStatus()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { userId, isStarred } = this.props
    if (isStarred && nextProps.userId && nextProps.userId !== userId) {
      this.checkXpStatus()
    }
    if (userId && !nextProps.userId) {
      this.setState(() => ({ xpEarned: false }))
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
        {isStarred && (
          <StarMark style={{ top: 1, left: 1 }} size={2} />
        )}
      </div>
    )
  }

  checkXpStatus = async() => {
    const { videoId } = this.props
    const authorization = auth()
    const authExists = !!authorization.headers.authorization
    if (authExists) {
      try {
        const { data: { xpEarned } } = await request.get(
          `${API_URL}/xpEarned?videoId=${videoId}`,
          auth()
        )
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
