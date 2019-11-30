import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import request from 'axios';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { cleanString, getFileInfoFromFileName } from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';
import URL from 'constants/URL';
import {
  isValidYoutubeUrl,
  isValidGipfyGifUrl,
  toValidGipfyGifUrl
} from '../helpers/stringHelpers';
import ReactPlayer from 'react-player';

const API_URL = `${URL}/content`;

Embedly.propTypes = {
  contentId: PropTypes.number,
  small: PropTypes.bool,
  imageHeight: PropTypes.string,
  imageMobileHeight: PropTypes.string,
  imageOnly: PropTypes.bool,
  loadingHeight: PropTypes.string,
  mobileLoadingHeight: PropTypes.string,
  noLink: PropTypes.bool,
  style: PropTypes.object,
  contentType: PropTypes.string
};

function Embedly({
  contentId,
  contentType = 'url',
  imageHeight = '100%',
  imageMobileHeight = '100%',
  imageOnly,
  loadingHeight = '100%',
  mobileLoadingHeight = '100%',
  noLink,
  small,
  style
}) {
  const translator = {
    actualDescription:
      contentType === 'url' ? 'actualDescription' : 'linkDescription',
    actualTitle: contentType === 'url' ? 'actualTitle' : 'linkTitle',
    siteUrl: contentType === 'url' ? 'siteUrl' : 'linkUrl',
    url: contentType === 'url' ? 'content' : 'embeddedUrl'
  };
  const {
    actions: {
      onSetActualDescription,
      onSetActualTitle,
      onSetPrevUrl,
      onSetSiteUrl,
      onSetThumbUrl
    }
  } = useContentContext();
  const {
    description,
    prevUrl,
    thumbUrl,
    title,
    thumbLoaded,
    [translator.actualDescription]: actualDescription,
    [translator.actualTitle]: actualTitle,
    [translator.siteUrl]: siteUrl,
    [translator.url]: url
  } = useContentState({ contentType, contentId });

  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const isYouTube = useMemo(() => {
    return contentType === 'chat' && isValidYoutubeUrl(url);
  }, [contentType, url]);
  const isGiphyGif = useMemo(() => {
    return contentType === 'chat' && isValidGipfyGifUrl(url);
  }, [contentType, url]);
  const mounted = useRef(true);
  const fallbackImage = '/img/link.png';
  const contentCss = useMemo(
    () => css`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      color: ${Color.darkerGray()};
      position: relative;
      overflow: hidden;
      ${!small ? 'flex-direction: column;' : ''};
    `,
    [small]
  );

  useEffect(() => {
    mounted.current = true;
    if (
      !thumbUrl &&
      url &&
      (typeof siteUrl !== 'string' || (prevUrl && url !== prevUrl))
    ) {
      fetchUrlData();
    }
    onSetPrevUrl({ contentId, contentType, prevUrl: url, thumbUrl });
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
          onSetActualDescription({ contentId, contentType, description });
          onSetActualTitle({ contentId, contentType, title });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevUrl, url, thumbLoaded, thumbUrl]);

  useEffect(() => {
    setImageUrl(
      url && getFileInfoFromFileName(url)?.fileType === 'image'
        ? url
        : thumbUrl || fallbackImage
    );
  }, [thumbUrl, url]);

  const InnerContent = useMemo(() => {
    return (
      <>
        {!imageUrl || loading ? (
          <Loading
            className={css`
              height: ${loadingHeight};
              @media (max-width: ${mobileMaxWidth}) {
                height: ${mobileLoadingHeight};
              }
            `}
          />
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
                object-fit: ${contentType === 'chat' ? 'contain' : 'cover'};
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
              line-height: 1.5;
              padding: 1rem;
              ${contentType === 'chat' ? 'margin-bottom: 1rem;' : ''}
              ${small ? 'margin-left: 1rem;' : ''}
              ${small ? '' : 'margin-top: 1rem;'}
            `}
          >
            <h3>{cleanString(actualTitle || title)}</h3>
            <p>{cleanString(actualDescription || description)}</p>
            <p style={{ fontWeight: 'bold' }}>{siteUrl}</p>
          </section>
        )}
      </>
    );
    function onImageLoadError() {
      setImageUrl(
        !thumbUrl || imageUrl === thumbUrl ? fallbackImage : thumbUrl
      );
    }
  }, [
    actualDescription,
    actualTitle,
    contentType,
    description,
    imageHeight,
    imageMobileHeight,
    imageOnly,
    imageUrl,
    loading,
    loadingHeight,
    mobileLoadingHeight,
    siteUrl,
    small,
    thumbUrl,
    title
  ]);

  return (
    <div
      style={{
        width: contentType === 'chat' ? '50%' : '100%',
        height: '100%',
        ...style
      }}
      className={css`
        display: flex;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
    >
      <div
        className={css`
          width: 100%;
          height: 100%;
          > a {
            text-decoration: none;
          }
          h3 {
            font-size: ${contentType === 'chat' ? '1.4rem' : '1.9rem'};
          }
          p {
            font-size: ${contentType === 'chat' ? '1.2rem' : '1.5rem'};
            margin-top: 1rem;
          }
        `}
      >
        {noLink ? (
          <div className={contentCss}>{InnerContent}</div>
        ) : isYouTube ? (
          <ReactPlayer width="50vw" height="30vw" url={url} controls />
        ) : isGiphyGif ? (
          <img
            alt={'Gif of ' + toValidGipfyGifUrl(url)}
            src={toValidGipfyGifUrl(url)}
          />
        ) : (
          <a
            className={contentCss}
            target="_blank"
            rel="noopener noreferrer"
            href={url}
          >
            {InnerContent}
          </a>
        )}
      </div>
    </div>
  );
}

export default memo(Embedly);
