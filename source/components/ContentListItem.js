import React from 'react';
import PropTypes from 'prop-types';
import VideoThumbImage from 'components/VideoThumbImage';
import Link from 'components/Link';
import LongText from 'components/Texts/LongText';
import Embedly from 'components/Embedly';
import DifficultyBar from 'components/DifficultyBar';
import { connect } from 'react-redux';
import { cleanString } from 'helpers/stringHelpers';
import { Color, borderRadius } from 'constants/css';
import { css } from 'emotion';

ContentListItem.propTypes = {
  contentObj: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  profileTheme: PropTypes.string,
  type: PropTypes.string.isRequired
};

function ContentListItem({
  onClick = () => {},
  type,
  contentObj,
  profileTheme
}) {
  const themeColor = profileTheme || 'logoBlue';
  return (
    <div
      style={{
        borderRadius,
        marginBottom: '1rem'
      }}
      className={css`
        border: 1px solid;
        border-color: ${Color.borderGray()};
        background: #fff;
        .label {
          color: ${Color.darkGray()};
        }
        &:hover {
          .label {
            color: ${Color[themeColor]()};
            transition: color 0.3s;
          }
          box-shadow: 0 0 5px ${Color[themeColor](0.8)};
          border-color: ${Color[themeColor](0.8)};
          transition: box-shadow 0.3s, border-color 0.3s;
        }
      `}
    >
      <div style={{ padding: '1rem 1rem 0 1rem' }}>
        <Link
          style={{ textDecoration: 'none' }}
          to={`/${type === 'url' ? 'link' : type}s/${contentObj.id}`}
          onClick={onClick}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              fontSize: '1.3rem',
              minHeight: type === 'subject' ? '10rem' : ''
            }}
          >
            {type === 'video' && (
              <div
                style={{ display: 'flex', alignItems: 'center', width: '25%' }}
              >
                <VideoThumbImage
                  difficulty={contentObj.difficulty}
                  videoId={contentObj.id}
                  src={`https://img.youtube.com/vi/${
                    contentObj.content
                  }/mqdefault.jpg`}
                />
              </div>
            )}
            <div
              style={{
                width: type !== 'subject' && type !== 'url' ? '75%' : '100%',
                padding: '1rem 0',
                ...(type === 'url' ? { paddingTop: '0.5rem' } : {})
              }}
            >
              {type === 'video' && (
                <>
                  <div style={{ marginLeft: '1rem' }}>
                    <p
                      style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        lineHeight: 1.5
                      }}
                      className="label"
                    >
                      {cleanString(contentObj.title)}
                    </p>
                    <p style={{ color: Color.gray() }}>
                      Uploaded by {contentObj.uploader.username}
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: '1rem',
                      color: Color.darkerGray()
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
                      {contentObj.description}
                    </LongText>
                  </div>
                </>
              )}
              {type === 'subject' && (
                <div
                  style={{
                    display: 'flex'
                  }}
                >
                  <div className="label">
                    <LongText
                      noExpand
                      cleanString
                      maxLines={4}
                      style={{
                        fontWeight: 'bold',
                        fontSize: '2.5rem'
                      }}
                    >
                      {contentObj.title}
                    </LongText>
                    <p style={{ color: Color.gray() }}>
                      Posted by {contentObj.uploader.username}
                    </p>
                    {contentObj.description && (
                      <div
                        style={{
                          marginTop: '1rem',
                          width: '100%',
                          textAlign: 'center',
                          color: Color.darkerGray()
                        }}
                      >
                        <LongText noExpand cleanString maxLines={4}>
                          {contentObj.description}
                        </LongText>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {type === 'url' && (
                <div>
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '2rem'
                    }}
                    className="label"
                  >
                    {cleanString(contentObj.title)}
                  </span>
                  <Embedly
                    small
                    noLink
                    style={{ marginTop: '0.5rem' }}
                    title={cleanString(contentObj.title)}
                    url={contentObj.content}
                    {...contentObj}
                  />
                </div>
              )}
            </div>
            {type === 'subject' && contentObj.rootObj && (
              <div
                style={{ display: 'flex', alignItems: 'center', width: '25%' }}
              >
                {contentObj.rootObj.type === 'video' && (
                  <VideoThumbImage
                    difficulty={contentObj.rootObj.difficulty}
                    videoId={contentObj.rootObj.id}
                    src={`https://img.youtube.com/vi/${
                      contentObj.rootObj.content
                    }/mqdefault.jpg`}
                  />
                )}
                {contentObj.rootObj.type === 'url' && (
                  <Embedly
                    imageOnly
                    noLink
                    title={cleanString(contentObj.rootObj.title)}
                    url={contentObj.rootObj?.content}
                    {...contentObj.rootObj}
                  />
                )}
              </div>
            )}
          </div>
        </Link>
      </div>
      <div
        style={{
          marginLeft: '-1px',
          marginRight: '-1px',
          paddingTop: '1rem',
          paddingBottom: !!contentObj.difficulty && '1rem'
        }}
      >
        {!!contentObj.difficulty && type === 'subject' && (
          <DifficultyBar
            style={{ fontSize: '1.3rem' }}
            difficulty={contentObj.difficulty}
          />
        )}
      </div>
    </div>
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(ContentListItem);
