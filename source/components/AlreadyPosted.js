import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';

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
  contentId,
  contentType,
  changingPage,
  style,
  uploaderId,
  url,
  videoCode
}) {
  const {
    requestHelpers: { checkIfContentExists }
  } = useAppContext();
  const {
    actions: { onSetExistingContent }
  } = useContentContext();
  const { existingContent, byUser } = useContentState({
    contentType,
    contentId
  });
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    if (!existingContent) {
      checkExists();
    }
    async function checkExists() {
      setLoading(true);
      const { content } = await checkIfContentExists({
        contentType,
        url,
        videoCode
      });
      if (mounted.current) {
        onSetExistingContent({ contentId, contentType, content });
        setLoading(false);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [url]);
  return useMemo(() => {
    return !changingPage &&
      !loading &&
      existingContent &&
      existingContent.id !== contentId &&
      !(byUser && uploaderId !== existingContent.uploader) ? (
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
  }, [
    byUser,
    existingContent,
    changingPage,
    loading,
    uploaderId,
    url,
    videoCode
  ]);
}
