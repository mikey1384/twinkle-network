import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionPanel from './DiscussionPanel';
import Button from 'components/Button';
import { loadDiscussions } from 'helpers/requestHelpers';
import { css } from 'emotion';

export default class Discussions extends Component {
  static propTypes = {
    discussions: PropTypes.array,
    onLoadMoreDiscussions: PropTypes.func.isRequired,
    loadMoreDiscussionsButton: PropTypes.bool,
    style: PropTypes.object,
    type: PropTypes.string,
    contentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };
  render() {
    const {
      discussions,
      loadMoreDiscussionsButton,
      style = {},
      type,
      contentId
    } = this.props;
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
              contentId={Number(contentId)}
              type={type}
              {...discussion}
            />
          ))}
        {loadMoreDiscussionsButton && (
          <Button
            style={{ width: '100%', borderRadius: 0 }}
            filled
            info
            onClick={this.onLoadMoreDiscussions}
          >
            Load More Discussions
          </Button>
        )}
      </div>
    );
  }

  onLoadMoreDiscussions = async() => {
    const { onLoadMoreDiscussions, type, contentId, discussions } = this.props;
    const data = await loadDiscussions({
      type,
      contentId,
      lastDiscussionId: discussions[discussions.length - 1].id
    });
    onLoadMoreDiscussions(data);
  };
}
