import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { useChatContext } from 'contexts';
import { Color, borderRadius } from 'constants/css';

TargetMessagePreview.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default function TargetMessagePreview({ onClose }) {
  const {
    state: { replyTarget }
  } = useChatContext();

  return (
    <div
      style={{
        height: '12rem',
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
          top: '4rem',
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
          overflow: 'scroll'
        }}
      >
        <p
          style={{
            fontWeight: 'bold',
            color: Color.black()
          }}
        >
          {replyTarget.username}
        </p>
        <span>{replyTarget.content}</span>
      </div>
    </div>
  );
}
