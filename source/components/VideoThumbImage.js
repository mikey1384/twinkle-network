import React, {Component} from 'react'
import PropTypes from 'prop-types'
import StarMark from 'components/StarMark'
import {URL} from 'constants/URL'
import {auth} from 'redux/actions/constants'
import request from 'axios'
import {connect} from 'react-redux'
import {Color} from 'constants/css'

const API_URL = `${URL}/video`

class VideoThumbImage extends Component {
  static propTypes = {
    divStyle: PropTypes.object,
    imgStyle: PropTypes.object,
    imgProps: PropTypes.object,
    isStarred: PropTypes.bool,
    src: PropTypes.string.isRequired,
    videoId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  }

  state = {
    xpEarned: false
  }

  mounted = false

  async componentWillMount() {
    const {userId, videoId, isStarred} = this.props
    this.mounted = true
    if (isStarred && userId) {
      const {data: {xpEarned}} = await request.get(`${API_URL}/xpEarned?videoId=${videoId}`, auth())
      if (this.mounted) this.setState(() => ({xpEarned}))
    }
  }

  async componentDidUpdate(prevProps) {
    const {videoId, isStarred} = this.props
    if (prevProps.videoId !== videoId) {
      if (!isStarred) return this.setState(() => ({xpEarned: false}))
      const {data: {xpEarned}} = await request.get(`${API_URL}/xpEarned?videoId=${videoId}`, auth())
      if (this.mounted) this.setState(() => ({xpEarned}))
    }
  }

  async componentWillReceiveProps(nextProps) {
    const {userId, videoId, isStarred} = this.props
    if (isStarred && nextProps.userId && nextProps.userId !== userId) {
      const {data: {xpEarned}} = await request.get(`${API_URL}/xpEarned?videoId=${videoId}`, auth())
      if (this.mounted) this.setState(() => ({xpEarned}))
    }
    if (userId && !nextProps.userId) {
      this.setState(() => ({xpEarned: false}))
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {src, isStarred, imgStyle, divStyle, imgProps} = this.props
    const {xpEarned} = this.state
    return (
      <div
        style={divStyle}
      >
        <img
          {...imgProps}
          alt="Thumbnail"
          src={src}
          style={{
            ...imgStyle,
            borderBottom: !!xpEarned && `1.5rem solid ${Color.lightBlue}`
          }}
        />
        {isStarred && <StarMark size={3} />}
      </div>
    )
  }
}

export default connect(state => ({userId: state.UserReducer.userId}))(VideoThumbImage)
