import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';
import { truncateText } from 'helpers/stringHelpers';
import { css } from 'emotion';

export default class Attachment extends Component {
  static propTypes = {
    attachment: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
  };

  render() {
    const { attachment, onClose } = this.props;
    return (
      <ErrorBoundary
        style={{
          width: '8rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <Icon
          icon="times"
          style={{
            display: 'flex',
            background: '#000',
            color: '#fff',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0.2rem',
            width: '2rem',
            height: '2rem',
            position: 'absolute',
            cursor: 'pointer',
            right: '-0.5rem',
            top: '-0.5rem'
          }}
          onClick={onClose}
        />
        <div
          className={css`
            &:hover {
              color: ${Color.blue()};
            }
          `}
          style={{ cursor: 'pointer', textAlign: 'center' }}
          onClick={() =>
            window.open(
              `/${attachment.type === 'url' ? 'links' : 'videos'}/${
                attachment.id
              }`
            )
          }
        >
          <div style={{ fontSize: '1.5rem' }}>
            {attachment.type === 'video' ? (
              <Icon icon="film" />
            ) : (
              <Icon icon="link" />
            )}
          </div>
          {truncateText({ text: attachment.title, limit: 20 })}
        </div>
      </ErrorBoundary>
    );
  }
}
