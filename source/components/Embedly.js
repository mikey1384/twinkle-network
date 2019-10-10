import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import request from 'axios';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { cleanString, getFileInfoFromFileName } from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { useContentContext } from 'contexts';
import URL from 'constants/URL';

const API_URL = `${URL}/content`;

Embedly.propTypes = {
  contentId: PropTypes.number,
  forChat: PropTypes.bool,
  small: PropTypes.bool,
  imageHeight: PropTypes.string,
  imageMobileHeight: PropTypes.string,
  imageOnly: PropTypes.bool,
  loadingHeight: PropTypes.string,
  noLink: PropTypes.bool,
  style: PropTypes.object,
  contentType: PropTypes.string
};

export default function Embedly({
  contentId,
  contentType = 'url',
  forChat,
  imageHeight = '100%',
  imageMobileHeight = '100%',
  imageOnly,
  loadingHeight = '100%',
  noLink,
  small,
  style
}) {
  const {
    state,
    actions: {
      onSetActualDescription,
      onSetActualTitle,
      onSetPrevUrl,
      onSetSiteUrl,
      onSetThumbUrl
    }
  } = useContentContext();
  const contentState = state[contentType + contentId] || {};
  const {
    actualDescription,
    actualTitle,
    description,
    prevUrl,
    thumbUrl,
    siteUrl,
    title,
    content
  } = contentState;
  const url = content;
  const [imageUrl, setImageUrl] = useState(
    !thumbUrl && typeof siteUrl === 'string'
      ? '/img/link.png'
      : thumbUrl?.replace('http://', 'https://')
  );
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  const fallbackImage = '/img/link.png';
  const contentCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: ${Color.darkerGray()};
    position: relative;
    overflow: hidden;
    ${!small ? 'flex-direction: column;' : ''};
  `;

  useEffect(() => {
    setImageUrl(
      url && getFileInfoFromFileName(url)?.fileType === 'image' ? url : thumbUrl
    );
  }, [thumbUrl]);

  useEffect(() => {
    mounted.current = true;
    if (url && (typeof siteUrl !== 'string' || (prevUrl && url !== prevUrl))) {
      fetchUrlData();
    }
    onSetPrevUrl({ contentId, contentType, prevUrl: url });
    async function fetchUrlData() {
      try {
        setLoading(true);
        const {
          data: { image, title, description, site }
        } = await request.put(`${API_URL}/embed`, {
          url,
          contentId,
          contentType
        });
        if (mounted.current) {
          onSetThumbUrl({
            contentId,
            contentType,
            thumbUrl: image.url.replace('http://', 'https://')
          });
          onSetActualTitle({ contentId, contentType, title });
          onSetActualDescription({ contentId, contentType, description });
          onSetSiteUrl({ contentId, contentType, siteUrl: site });
          setLoading(false);
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [url]);

  return useMemo(
    () => (
      <div
        className={css`
          width: 100%;
          height: 100%;
          > a {
            text-decoration: none;
          }
          h3 {
            font-size: 1.9rem;
          }
          p {
            font-size: 1.4rem;
            margin-top: 1rem;
          }
          @media (max-width: ${mobileMaxWidth}) {
            h3 {
              font-size: ${forChat ? '1.4rem' : '1.9rem'};
            }
            p {
              font-size: ${forChat ? '1.1rem' : '1.4rem'};
              margin-top: 1rem;
            }
          }
        `}
        style={style}
      >
        {noLink ? (
          <div className={contentCss}>{renderInner()}</div>
        ) : (
          <a
            className={contentCss}
            target="_blank"
            rel="noopener noreferrer"
            href={url}
          >
            {renderInner()}
          </a>
        )}
      </div>
    ),
    [contentState, loading]
  );

  function onImageLoadError() {
    setImageUrl(!thumbUrl || imageUrl === thumbUrl ? fallbackImage : thumbUrl);
  }

  function renderInner() {
    return (
      <>
        {loading ? (
          <Loading style={{ height: loadingHeight }} />
        ) : (
          <section
            className={css`
              position: relative;
              width: ${small ? '25%' : '100%'};
              height: ${imageHeight};
              &:after {
                content: '';
                display: block;
                padding-bottom: ${small ? '100%' : '60%'};
              }
              @media (max-width: ${mobileMaxWidth}) {
                height: ${imageMobileHeight};
              }
            `}
          >
            <img
              className={css`
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: ${forChat ? 'contain' : 'cover'};
              `}
              src={imageUrl}
              onError={onImageLoadError}
              alt={title}
            />
          </section>
        )}
        {!imageOnly && (
          <section
            className={css`
              width: 100%;
              padding: 1rem;
              line-height: 1.5;
              ${small ? 'margin-left: 1rem;' : ''};
              ${small ? '' : 'margin-top: 1rem;'};
            `}
          >
            <h3>{cleanString(actualTitle || title)}</h3>
            <p>{cleanString(actualDescription || description)}</p>
            <p style={{ fontWeight: 'bold' }}>{siteUrl}</p>
          </section>
        )}
      </>
    );
  }
}
