import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useAppContext } from 'context';

AlreadyPosted.propTypes = {
  changingPage: PropTypes.bool,
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  style: PropTypes.object,
  uploaderId: PropTypes.number,
  videoCode: PropTypes.string
};

export default function AlreadyPosted({
  changingPage,
  contentId,
  style,
  contentType,
  uploaderId,
  url,
  videoCode
}) {
  const {
    requestHelpers: { checkIfContentExists }
  } = useAppContext();
  const [existingContent, setExistingContent] = useState({});
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    checkExists();
    async function checkExists() {
      setLoading(true);
      const { content } = await checkIfContentExists({
        contentType,
        url,
        videoCode
      });
      if (mounted.current) {
        setExistingContent(content);
        setLoading(false);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [url]);
  return !changingPage &&
    existingContent.id &&
    !loading &&
    existingContent.id !== contentId ? (
    <div
      style={{
        fontSize: '1.6rem',
        padding: '1rem',
        color: uploaderId !== existingContent.uploader ? '#000' : '#fff',
        backgroundColor:
          uploaderId !== existingContent.uploader
            ? Color.orange()
            : Color.blue(),
        ...style
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
        to={`/${contentType === 'url' ? 'link' : 'video'}s/${
          existingContent.id
        }`}
      >
        already been posted before
        {uploaderId !== existingContent.uploader ? ' by someone else' : ''}
      </Link>
    </div>
  ) : null;
}
