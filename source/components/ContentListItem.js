import React, { useState } from 'react';
import PropTypes from 'prop-types';
import VideoThumbImage from 'components/VideoThumbImage';
import Link from 'components/Link';
import LongText from 'components/Texts/LongText';
import Embedly from 'components/Embedly';
import DifficultyBar from 'components/DifficultyBar';
import { connect } from 'react-redux';
import { cleanString } from 'helpers/stringHelpers';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

ContentListItem.propTypes = {
  contentObj: PropTypes.object.isRequired,
  expandable: PropTypes.bool,
  onClick: PropTypes.func,
  profileTheme: PropTypes.string,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  style: PropTypes.object
};

function ContentListItem({
  onClick = () => {},
  contentObj,
  contentObj: { type },
  expandable,
  profileTheme,
  selectable,
  selected,
  style
}) {
  const themeColor = profileTheme || 'logoBlue';
  const [mouseEntered, setMouseEntered] = useState(false);
  return (
    <div
      onTouchStart={() => setMouseEntered(true)}
      onMouseEnter={() => setMouseEntered(true)}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius,
        boxShadow: selected ? `0 0 5px ${Color[themeColor](0.8)}` : null,
        border: selected ? `0.5rem solid ${Color[themeColor](0.8)}` : null,
        ...style
      }}
      className={css`
        border: 1px solid ${Color.borderGray()};
        background: ${expandable ? Color.whiteGray() : '#fff'};
        .label {
          color: ${expandable ? Color.darkerGray() : Color.darkGray()};
          transition: color 1s;
        }
        margin-top: ${expandable ? (mouseEntered ? '-0.5rem' : '-2rem') : ''};
        transition: background 0.5s, border 0.5s, margin-top 0.5s;
        &:hover {
          border-color: ${Color.darkerBorderGray()};
          .label {
            color: ${expandable ? Color.darkGray() : Color.darkerGray()};
          }
          background: ${expandable ? '#fff' : Color.highlightGray()};
        }
        @media (max-width: ${mobileMaxWidth}) {
          margin-top: -0.5rem;
        }
      `}
    >
      <Link
        style={{ textDecoration: 'none' }}
        to={
          expandable || selectable
            ? ''
            : `/${type === 'url' ? 'link' : type}s/${contentObj.id}`
        }
      >
        <div style={{ padding: '1rem' }}>
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '25%'
                }}
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
                      marginLeft: '1rem',
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
                          textAlign: 'left',
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
        </div>
        {!!contentObj.difficulty && type === 'subject' && (
          <div
            style={{
              marginLeft: '-1px',
              marginRight: '-1px',
              paddingBottom: !!contentObj.difficulty && '1rem'
            }}
          >
            <DifficultyBar
              style={{ fontSize: '1.3rem' }}
              difficulty={contentObj.difficulty}
            />
          </div>
        )}
      </Link>
    </div>
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(ContentListItem);
