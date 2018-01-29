import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { loadVideoPageFromClientSideAsync } from 'redux/actions/VideoActions'
import { loadLinkPage } from 'redux/actions/LinkActions'
import Link from 'components/Link'
import { Color } from 'constants/css'

ContentLink.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string
  }).isRequired,
  type: PropTypes.string
}
function ContentLink({ content: { id, title }, type, ...actions }) {
  let destination = ''
  switch (type) {
    case 'url':
      destination = 'links'
      break
    case 'video':
      destination = 'videos'
      break
    case 'comment':
      destination = 'comments'
      break
    case 'question':
      destination = 'questions'
      break
    default:
      break
  }

  return title ? (
    <Link
      style={{
        fontWeight: 'bold',
        color: Color.blue
      }}
      to={`/${destination}/${id}`}
      onClickAsync={() => onLinkClick({ id, type, actions })}
    >
      {title}
    </Link>
  ) : (
    <span style={{ fontWeight: 'bold', color: Color.darkGray }}>(Deleted)</span>
  )
}

function onLinkClick({ id, type, actions: { loadLinkPage, loadVideoPage } }) {
  switch (type) {
    case 'url':
      return loadLinkPage(id)
    case 'video':
      return loadVideoPage(id)
    default:
      return Promise.resolve()
  }
}

export default connect(null, {
  loadVideoPage: loadVideoPageFromClientSideAsync,
  loadLinkPage
})(ContentLink)
