import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { checkIfContentExists } from 'helpers/requestHelpers';

export default class AlreadyPosted extends Component {
  static propTypes = {
    changingPage: PropTypes.bool,
    contentId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    style: PropTypes.object,
    uploaderId: PropTypes.number,
    videoCode: PropTypes.string
  };

  existingContent = {};
  mounted = false;

  state = {
    loading: false
  };

  async componentDidMount() {
    this.mounted = true;
    const { type, url, videoCode } = this.props;
    const { content: existingContent } = await checkIfContentExists({
      type,
      url,
      videoCode
    });
    if (this.mounted) this.existingContent = existingContent;
  }

  async componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.setState({ existingContent: {} });
      const { type, url, videoCode } = this.props;
      const { content: existingContent } = await checkIfContentExists({
        type,
        url,
        videoCode
      });
      if (this.mounted) this.existingContent = existingContent;
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { changingPage, contentId, style, type, uploaderId } = this.props;
    return !changingPage &&
      this.existingContent.id &&
      this.existingContent.id !== contentId ? (
      <div
        style={{
          fontSize: '1.6rem',
          padding: '1rem',
          color: uploaderId !== this.existingContent.uploader ? '#000' : '#fff',
          backgroundColor:
            uploaderId !== this.existingContent.uploader
              ? Color.orange()
              : Color.blue(),
          ...style
        }}
        className={css`
          > a {
            color: ${uploaderId !== this.existingContent.uploader
              ? '#000'
              : '#fff'};
            font-weight: bold;
          }
        `}
      >
        This content has{' '}
        <Link
          style={{ fontWeight: 'bold' }}
          to={`/${type === 'url' ? 'link' : 'video'}s/${
            this.existingContent.id
          }`}
        >
          already been posted before
          {uploaderId !== this.existingContent.uploader
            ? ' by someone else'
            : ''}
        </Link>
      </div>
    ) : null;
  }
}
