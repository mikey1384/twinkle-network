import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import VideoThumbImage from 'components/VideoThumbImage';
import Link from 'components/Link';
import LongText from 'components/Texts/LongText';
import Embedly from 'components/Embedly';
import RewardLevelBar from 'components/RewardLevelBar';
import SecretAnswer from 'components/SecretAnswer';
import { cleanString } from 'helpers/stringHelpers';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useAppContext } from 'contexts';

ContentListItem.propTypes = {
  comments: PropTypes.array,
  contentObj: PropTypes.object.isRequired,
  expandable: PropTypes.bool,
  onClick: PropTypes.func,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  style: PropTypes.object
};

export default function ContentListItem({
  onClick = () => {},
  contentObj,
  contentObj: { id: contentId, contentType },
  expandable,
  selectable,
  selected,
  style
}) {
  const {
    user: {
      state: { profileTheme }
    }
  } = useAppContext();
  const [mouseEntered, setMouseEntered] = useState(false);
  return useMemo(
    () => (
      <div
        onTouchStart={() => setMouseEntered(true)}
        onMouseEnter={() => setMouseEntered(true)}
        onClick={onClick}
        style={{
          cursor: 'pointer',
          borderRadius,
          boxShadow: selected ? `0 0 5px ${Color[profileTheme](0.8)}` : null,
          border: selected ? `0.5rem solid ${Color[profileTheme](0.8)}` : null,
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
              : `/${contentType === 'url' ? 'link' : contentType}s/${
                  contentObj.id
                }`
          }
        >
          <div style={{ padding: '1rem' }}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                fontSize: '1.3rem',
                minHeight: contentType === 'subject' ? '10rem' : ''
              }}
            >
              {contentType === 'video' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '25%'
                  }}
                >
                  <VideoThumbImage
                    rewardLevel={contentObj.rewardLevel}
                    videoId={contentId}
                    src={`https://img.youtube.com/vi/${contentObj.content}/mqdefault.jpg`}
                  />
                </div>
              )}
              <div
                style={{
                  width:
                    contentType !== 'subject' && contentType !== 'url'
                      ? '75%'
                      : '100%',
                  padding: '1rem 0',
                  ...(contentType === 'url' ? { paddingTop: '0.5rem' } : {})
                }}
              >
                {contentType === 'video' && (
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
                {contentType === 'book' && (
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
                        Written by {contentObj.uploader.username}
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
                {contentType === 'subject' && (
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
                {contentType === 'url' && (
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
                      contentId={contentId}
                      {...contentObj}
                    />
                  </div>
                )}
              </div>
              {contentType === 'subject' && contentObj.rootObj?.id && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '25%',
                    marginBottom: contentObj.secretAnswer ? '1rem' : ''
                  }}
                >
                  {contentObj.rootObj?.contentType === 'video' && (
                    <VideoThumbImage
                      rewardLevel={contentObj.rootObj.rewardLevel}
                      videoId={contentObj.rootObj.id}
                      src={`https://img.youtube.com/vi/${contentObj.rootObj.content}/mqdefault.jpg`}
                    />
                  )}
                  {contentObj.rootObj?.contentType === 'url' && (
                    <Embedly
                      imageOnly
                      noLink
                      title={cleanString(contentObj.rootObj.title)}
                      url={contentObj.rootObj?.content}
                      contentId={contentObj.rootObj?.id}
                      {...contentObj.rootObj}
                    />
                  )}
                </div>
              )}
            </div>
            {contentType === 'subject' && contentObj.secretAnswer && (
              <SecretAnswer
                answer={contentObj.secretAnswer}
                subjectId={contentId}
                uploaderId={contentObj.uploader.id}
              />
            )}
          </div>
          {!!contentObj.rewardLevel && contentType === 'subject' && (
            <div
              style={{
                marginLeft: '-1px',
                marginRight: '-1px',
                paddingBottom: !!contentObj.rewardLevel && '1rem'
              }}
            >
              <RewardLevelBar
                style={{ fontSize: '1.3rem' }}
                rewardLevel={contentObj.rewardLevel}
              />
            </div>
          )}
        </Link>
      </div>
    ),
    [contentObj, mouseEntered, selected, onClick, profileTheme]
  );
}
