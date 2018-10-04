import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { checkIfContentExists } from 'helpers/requestHelpers';

export default class AlreadyPosted extends Component {
  static propTypes = {
    contentId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    uploaderId: PropTypes.number
  };

  state = {
    existingContent: {}
  };

  async componentDidMount() {
    const { type, url } = this.props;
    const { content: existingContent } = await checkIfContentExists({
      type,
      url
    });
    this.setState({ existingContent });
  }

  render() {
    const { existingContent = {} } = this.state;
    const { contentId, type, uploaderId } = this.props;
    return existingContent.id && existingContent.id !== contentId ? (
      <div
        style={{
          fontSize: '1.6rem',
          padding: '1rem',
          color: uploaderId !== existingContent.uploader ? '#000' : '#fff',
          backgroundColor:
            uploaderId !== existingContent.uploader
              ? Color.orange()
              : Color.blue()
        }}
        className={css`
          > a {
            color: ${uploaderId !== existingContent.uploader ? '#000' : '#fff'};
            font-weight: bold;
          }
        `}
      >
        This content has{' '}
        <Link
          style={{ fontWeight: 'bold' }}
          to={`/${type === 'url' ? 'link' : 'video'}s/${existingContent.id}`}
        >
          already been posted before
          {uploaderId !== existingContent.uploader ? ' by someone else' : ''}
        </Link>
      </div>
    ) : null;
  }
}
