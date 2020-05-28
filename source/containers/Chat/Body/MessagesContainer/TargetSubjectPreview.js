import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color, borderRadius } from 'constants/css';
import { useChatContext } from 'contexts';

TargetSubjectPreview.propTypes = {
  channelId: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

export default function TargetSubjectPreview({ channelId, onClose }) {
  const {
    state: { subjectObj }
  } = useChatContext();

  const { content } = subjectObj[channelId] || {};

  return (
    <div
      style={{
        height: '8rem',
        width: '100%',
        position: 'relative',
        padding: '1rem 6rem 2rem 0.5rem',
        marginBottom: '2px'
      }}
    >
      <Icon
        icon="times"
        size="lg"
        style={{
          position: 'absolute',
          right: '1.7rem',
          top: '2.5rem',
          cursor: 'pointer'
        }}
        onClick={onClose}
      />
      <div
        style={{
          padding: '1rem',
          height: '100%',
          width: '100%',
          background: Color.targetGray(),
          borderRadius,
          overflow: 'scroll',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ marginTop: '0.5rem', paddingBottom: '1rem' }}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
