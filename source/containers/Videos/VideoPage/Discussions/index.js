import React from 'react'
import PropTypes from 'prop-types'
import DiscussionPanel from './DiscussionPanel'
import InputForm from 'components/Texts/InputForm'
import { Color } from 'constants/css'
import Button from 'components/Button'
import { css } from 'emotion'

Discussions.propTypes = {
  discussions: PropTypes.array,
  loadMoreDiscussions: PropTypes.func.isRequired,
  loadMoreDiscussionsButton: PropTypes.bool,
  style: PropTypes.object,
  uploadComment: PropTypes.func.isRequired,
  videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
export default function Discussions({
  discussions,
  loadMoreDiscussions,
  loadMoreDiscussionsButton,
  style = {},
  uploadComment,
  videoId
}) {
  return (
    <div
      className={css`
        margin-top: 1rem;
      `}
      style={style}
    >
      {discussions &&
        discussions.map(discussion => (
          <DiscussionPanel
            key={discussion.id}
            videoId={videoId}
            {...discussion}
          />
        ))}
      {loadMoreDiscussionsButton && (
        <Button
          transparent
          onClick={() =>
            loadMoreDiscussions(videoId, discussions[discussions.length - 1].id)
          }
        >
          Load More
        </Button>
      )}
      {(!discussions || discussions.length === 0) && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            marginBottom: '-1rem',
            background: '#fff'
          }}
        >
          <span
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: Color.darkGray()
            }}
          >
            Comment on this video
          </span>
          <InputForm
            style={{ marginTop: '1rem' }}
            onSubmit={text => uploadComment(text, videoId)}
            rows={4}
            placeholder="Write your comment here..."
          />
        </div>
      )}
    </div>
  )
}
