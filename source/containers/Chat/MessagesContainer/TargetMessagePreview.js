import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { useChatContext } from 'contexts';
import { Color } from 'constants/css';

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
        height: '10rem',
        width: '100%',
        position: 'relative',
        paddingRight: '1rem',
        marginBottom: '2px'
      }}
    >
      <Icon
        icon="times"
        size="lg"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          cursor: 'pointer'
        }}
        onClick={onClose}
      />
      <div
        style={{
          padding: '1rem',
          height: '100%',
          width: '100%'
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            color: Color.black()
          }}
        >
          {replyTarget.username}
        </div>
        <div>{replyTarget.content}</div>
      </div>
    </div>
  );
}
