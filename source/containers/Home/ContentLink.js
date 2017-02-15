import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadVideoPageFromClientSideAsync} from 'redux/actions/VideoActions'
import {cleanString} from 'helpers/stringHelpers'

@connect(
  null,
  {
    loadVideoPage: loadVideoPageFromClientSideAsync
  }
)
export default class ContentLink extends Component {
  static propTypes = {
    content: PropTypes.object,
    loadVideoPage: PropTypes.func,
    type: PropTypes.string
  }

  constructor() {
    super()
    this.onLinkClick = this.onLinkClick.bind(this)
  }

  render() {
    const {content} = this.props
    return (
      <a
        style={{
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#158cba'
        }}
        onClick={this.onLinkClick}
        href={`videos/${content.id}`}
      >
        {cleanString(content.title)}
      </a>
    )
  }

  onLinkClick(event) {
    const {loadVideoPage, content: {content, id}, type} = this.props
    event.preventDefault()
    if (type === 'url') return window.open(content, '_blank')
    loadVideoPage(id, `videos/${id}`)
  }
}
