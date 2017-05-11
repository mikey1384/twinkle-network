import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {loadVideoPageFromClientSideAsync} from 'redux/actions/VideoActions'
import {loadLinkPage} from 'redux/actions/LinkActions'
import {cleanString} from 'helpers/stringHelpers'
import Link from 'components/Link'
import {Color} from 'constants/css'

@connect(
  null,
  {
    loadVideoPage: loadVideoPageFromClientSideAsync,
    loadLinkPage
  }
)
export default class ContentLink extends Component {
  static propTypes = {
    content: PropTypes.object,
    loadVideoPage: PropTypes.func,
    loadLinkPage: PropTypes.func,
    type: PropTypes.string
  }

  constructor() {
    super()
    this.onLinkClick = this.onLinkClick.bind(this)
  }

  render() {
    const {content, type} = this.props
    let destination = ''
    switch (type) {
      case 'url':
        destination = 'links'
        break
      case 'video':
        destination = 'videos'
        break
      default: break
    }

    return (
      <Link
        style={{
          fontWeight: 'bold',
          color: Color.blue
        }}
        to={`/${destination}/${content.id}`}
        onClickAsync={this.onLinkClick}
      >
        {cleanString(content.title)}
      </Link>
    )
  }

  onLinkClick(event) {
    const {loadVideoPage, loadLinkPage, type, content: {id}} = this.props
    switch (type) {
      case 'url':
        return loadLinkPage(id)
      case 'video':
        return loadVideoPage(id)
      default: return
    }
  }
}
