import React from 'react';
import PropTypes from 'prop-types';
import DiscussionPanel from './DiscussionPanel';
import Button from 'components/Button';
import { css } from 'emotion';

Discussions.propTypes = {
  discussions: PropTypes.array,
  loadMoreDiscussions: PropTypes.func.isRequired,
  loadMoreDiscussionsButton: PropTypes.bool,
  style: PropTypes.object,
  uploadComment: PropTypes.func.isRequired,
  videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
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
        margin: 1rem 0;
      `}
      style={style}
    >
      {discussions &&
        discussions.map(discussion => (
          <DiscussionPanel
            key={discussion.id}
            videoId={Number(videoId)}
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
    </div>
  );
}
