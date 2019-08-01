import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import request from 'axios';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import URL from 'constants/URL';

const API_URL = `${URL}/content`;

Embedly.propTypes = {
  actualDescription: PropTypes.string,
  actualTitle: PropTypes.string,
  contentId: PropTypes.number,
  forChat: PropTypes.bool,
  small: PropTypes.bool,
  imageHeight: PropTypes.string,
  imageMobileHeight: PropTypes.string,
  imageOnly: PropTypes.bool,
  loadingHeight: PropTypes.string,
  noLink: PropTypes.bool,
  siteUrl: PropTypes.string,
  style: PropTypes.object,
  thumbUrl: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
};

export default function Embedly({
  thumbUrl,
  actualTitle,
  actualDescription,
  contentId,
  forChat,
  imageHeight = '100%',
  imageMobileHeight = '100%',
  imageOnly,
  loadingHeight = '100%',
  noLink,
  siteUrl,
  small,
  style,
  type = 'url',
  url,
  ...props
}) {
  const [imageUrl, setImageUrl] = useState(
    thumbUrl ? thumbUrl.replace('http://', 'https://') : '/img/link.png'
  );
  const [title, setTitle] = useState(actualTitle);
  const [description, setDescription] = useState(actualDescription);
  const [site, setSite] = useState(siteUrl);
  const [prevUrl, setPrevUrl] = useState(url);
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
    mounted.current = true;
    if (url.substr(url.length - 4) === '.gif') {
      setImageUrl(url);
    }
    if (url && (!siteUrl || url !== prevUrl)) {
      fetchUrlData();
    }
    async function fetchUrlData() {
      try {
        setLoading(true);
        const {
          data: { image, title, description, site }
        } = await request.put(`${API_URL}/embed`, { url, contentId, type });
        if (mounted.current) {
          setImageUrl(
            url.substr(url.length - 4) === '.gif'
              ? url
              : image.url.replace('http://', 'https://')
          );
          setTitle(title);
          setDescription(description);
          setSite(site);
          setPrevUrl(url);
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

  return (
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
            <h3>{title || props.title}</h3>
            <p>{description}</p>
            <p style={{ fontWeight: 'bold' }}>{site}</p>
          </section>
        )}
      </>
    );
  }
}
