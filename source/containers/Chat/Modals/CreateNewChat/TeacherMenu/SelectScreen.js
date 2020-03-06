import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

SelectScreen.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSetSection: PropTypes.func.isRequired
};

export default function SelectScreen({ onHide, onSetSection }) {
  return (
    <ErrorBoundary>
      <header>Start a New Chat</header>
      <main>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '2rem',
                color: Color.black()
              }}
            >
              Regular Chat
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1.5rem'
              }}
            >
              <Button
                skeuomorphic
                style={{ fontSize: '3.5rem', padding: '1.5rem' }}
                color="blue"
                onClick={() => onSetSection('regular')}
              >
                <Icon icon="comments" />
              </Button>
            </div>
          </div>
          <div
            style={{
              width: '30%',
              flexDirection: 'column',
              alignItems: 'center',
              display: 'flex',
              marginLeft: '1rem'
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '2rem',
                color: Color.black()
              }}
            >
              Classroom
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1.5rem'
              }}
            >
              <Button
                skeuomorphic
                style={{ fontSize: '3.5rem', padding: '1.5rem' }}
                color="pink"
                onClick={() => onSetSection('classroom')}
              >
                <Icon icon="chalkboard-teacher" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Cancel
        </Button>
      </footer>
    </ErrorBoundary>
  );
}
