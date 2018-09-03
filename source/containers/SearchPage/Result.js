import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VideoThumbImage from 'components/VideoThumbImage';
import { cleanString } from 'helpers/stringHelpers';
import Link from 'components/Link';
import { Color } from 'constants/css';
import LongText from 'components/Texts/LongText';
import Embedly from 'components/Embedly';
import { css } from 'emotion';

Result.propTypes = {
  closeSearch: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  result: PropTypes.object.isRequired
};
export default function Result({ closeSearch, type, result }) {
  return (
    <Link
      style={{ textDecoration: 'none', marginBottom: '1rem' }}
      to={`/${type === 'url' ? 'link' : type}s/${result.id}`}
      onClick={closeSearch}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          fontSize: '1.3rem',
          background: '#fff'
        }}
      >
        {type !== 'question' &&
          type !== 'url' && (
            <div style={{ width: '25%' }}>
              {type === 'video' && (
                <VideoThumbImage
                  isStarred={!!result.isStarred}
                  videoId={result.id}
                  src={`https://img.youtube.com/vi/${
                    result.content
                  }/mqdefault.jpg`}
                />
              )}
              {type === 'discussion' && (
                <VideoThumbImage
                  isStarred={!!(result.rootObj || {}).isStarred}
                  videoId={(result.rootObj || {}).id}
                  src={`https://img.youtube.com/vi/${
                    (result.rootObj || {}).content
                  }/mqdefault.jpg`}
                />
              )}
            </div>
          )}
        <div
          style={{
            width: type !== 'question' && type !== 'url' ? '75%' : '100%',
            padding: '1rem',
            ...(type === 'url' ? { paddingTop: '0.5rem' } : {})
          }}
        >
          {type === 'video' && (
            <Fragment>
              <div>
                <p
                  style={{
                    fontSize: '1.7rem',
                    fontWeight: 'bold',
                    lineHeight: 1.5,
                    color: Color.blue()
                  }}
                >
                  {cleanString(result.title)}
                </p>
                <p style={{ color: Color.gray() }}>
                  Uploaded by {result.uploader.username}
                </p>
              </div>
              <div
                style={{
                  marginTop: '1rem',
                  color: Color.darkGray()
                }}
              >
                <LongText
                  className={css`
                    p {
                      text-overflow: ellipsis;
                      overflow: hidden;
                    }
                  `}
                  cleanString
                  noExpand
                  maxLines={4}
                >
                  {result.description}
                </LongText>
              </div>
            </Fragment>
          )}
          {type === 'question' && (
            <div
              style={{
                minHeight: '8vh',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <div
                style={{
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                <LongText
                  noExpand
                  cleanString
                  maxLines={4}
                  style={{
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    color: Color.green()
                  }}
                >
                  {result.content}
                </LongText>
                <div
                  style={{
                    fontWeight: 'normal',
                    marginTop: '0.5rem',
                    color: Color.gray()
                  }}
                >
                  asked by {result.uploader.username}
                </div>
              </div>
            </div>
          )}
          {type === 'discussion' && (
            <div>
              <LongText
                noExpand
                cleanString
                maxLines={4}
                style={{
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  color: Color.green()
                }}
              >
                {result.title}
              </LongText>
              <p style={{ color: Color.gray() }}>
                Posted by {result.uploader.username}
              </p>
              <div
                style={{
                  marginTop: '1rem',
                  color: Color.darkGray()
                }}
              >
                <LongText noExpand cleanString maxLines={4}>
                  {result.description}
                </LongText>
              </div>
            </div>
          )}
          {type === 'url' && (
            <div>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}
              >
                {cleanString(result.title)}
              </span>
              <Embedly
                small
                noLink
                style={{ marginTop: '0.5rem' }}
                title={cleanString(result.title)}
                url={result.content}
                {...result}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
