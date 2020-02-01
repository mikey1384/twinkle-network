import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import FullTextReveal from 'components/Texts/FullTextReveal';
import UsernameText from 'components/Texts/UsernameText';
import { edit } from 'constants/placeholders';
import { timeSince } from 'helpers/timeStampHelpers';

BasicInfos.propTypes = {
  className: PropTypes.string,
  editedUrl: PropTypes.string,
  editedTitle: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  onTitleKeyUp: PropTypes.func.isRequired,
  onUrlChange: PropTypes.func.isRequired,
  onEdit: PropTypes.bool.isRequired,
  titleHovered: PropTypes.bool.isRequired,
  onTitleClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
  titleExceedsCharLimit: PropTypes.func.isRequired,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  uploader: PropTypes.object.isRequired,
  urlExceedsCharLimit: PropTypes.func.isRequired
};

export default function BasicInfos({
  className,
  editedUrl,
  editedTitle,
  innerRef,
  onTitleChange,
  onTitleKeyUp,
  onUrlChange,
  onEdit,
  onMouseLeave,
  onMouseOver,
  onTitleClick,
  style,
  title,
  titleHovered,
  timeStamp,
  titleExceedsCharLimit,
  uploader,
  urlExceedsCharLimit
}) {
  return (
    <div className={className} style={style}>
      {onEdit ? (
        <div>
          <Input
            placeholder={edit.video}
            value={editedUrl}
            onChange={onUrlChange}
            style={urlExceedsCharLimit(editedUrl)?.style}
          />
          <Input
            placeholder={edit.title}
            value={editedTitle}
            onChange={onTitleChange}
            onKeyUp={onTitleKeyUp}
            style={{
              marginTop: '1rem',
              ...(titleExceedsCharLimit(editedTitle)?.style || {})
            }}
          />
          {titleExceedsCharLimit(editedTitle) && (
            <small style={{ color: 'red' }}>
              {titleExceedsCharLimit(editedTitle)?.message}
            </small>
          )}
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div
            ref={innerRef}
            style={{
              width: '100%',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              lineHeight: 'normal'
            }}
          >
            <span
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                cursor: 'default'
              }}
              onClick={onTitleClick}
              onMouseOver={onMouseOver}
              onMouseLeave={onMouseLeave}
            >
              {title}
            </span>
          </div>
          <FullTextReveal show={titleHovered} text={title} />
        </div>
      )}
      {!onEdit && (
        <div>
          Added by <UsernameText user={uploader} />{' '}
          <span>{`${timeStamp ? timeSince(timeStamp) : ''}`}</span>
        </div>
      )}
    </div>
  );
}
