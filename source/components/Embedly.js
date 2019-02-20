import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import request from 'axios';
import { css } from 'emotion';
import { Color } from 'constants/css';
import URL from 'constants/URL';

const API_URL = `${URL}/content`;

Embedly.propTypes = {
  actualDescription: PropTypes.string,
  actualTitle: PropTypes.string,
  small: PropTypes.bool,
  id: PropTypes.number.isRequired,
  imageOnly: PropTypes.bool,
  noLink: PropTypes.bool,
  siteUrl: PropTypes.string,
  style: PropTypes.object,
  thumbUrl: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
};

export default function Embedly({
  thumbUrl,
  actualTitle,
  actualDescription,
  id,
  imageOnly,
  noLink,
  siteUrl,
  small,
  style,
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
  const fallbackImage = '/img/link.png';
  const contentCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: ${Color.darkerGray()};
    position: relative;
    overflow: hidden;
    ${!small ? 'flex-direction: column;' : ''};
  `;

  useEffect(() => {
    let mounted = true;
    if (url && (!siteUrl || url !== prevUrl)) {
      fetchUrlData();
    }
    async function fetchUrlData() {
      try {
        const {
          data: { image, title, description, site }
        } = await request.put(`${API_URL}/embed`, { url, linkId: id });
        if (mounted) {
          setImageUrl(image.url.replace('http://', 'https://'));
          setTitle(title);
          setDescription(description);
          setSite(site);
          setPrevUrl(url);
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
    return () => (mounted = false);
  }, [url]);

  return (
    <div
      className={css`
        width: 100%;
        > a {
          text-decoration: none;
        }
        h3 {
          font-size: 1.9rem;
        }
        p {
          font-size: 1.5rem;
          margin-top: 1rem;
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
        <section
          className={css`
            position: relative;
            width: ${small ? '25%' : '100%'};
            &:after {
              content: '';
              display: block;
              padding-bottom: ${small ? '100%' : '60%'};
            }
          `}
        >
          <img
            className={css`
              position: absolute;
              width: 100%;
              height: 100%;
              object-fit: cover;
            `}
            src={imageUrl}
            onError={onImageLoadError}
            alt={title}
          />
        </section>
        {!imageOnly && (
          <section
            className={css`
              width: 100%;
              padding: 1rem;
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
