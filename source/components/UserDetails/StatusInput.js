import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import ColorSelector from 'components/ColorSelector';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { exceedsCharLimit, renderCharLimit } from 'helpers/stringHelpers';

StatusInput.propTypes = {
  autoFocus: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  statusColor: PropTypes.string,
  editedStatusMsg: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  onCancel: PropTypes.func.isRequired,
  onStatusSubmit: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired
};

export default function StatusInput({
  autoFocus,
  profile,
  editedStatusMsg,
  innerRef,
  onCancel,
  statusColor,
  onStatusSubmit,
  onTextChange,
  setColor
}) {
  return (
    <ErrorBoundary>
      <Textarea
        autoFocus={autoFocus}
        className={css`
          margin-top: 1rem;
          ${profile.statusMsg
            ? ''
            : `box-shadow: ${`0 0 1rem ${Color.logoBlue()}`}; border: 1px solid ${Color.logoBlue()}`};
        `}
        innerRef={innerRef}
        minRows={1}
        value={editedStatusMsg}
        onChange={onTextChange}
        placeholder={`Enter a ${profile.statusMsg ? 'new ' : ''}status message`}
        style={exceedsCharLimit({
          contentType: 'statusMsg',
          text: editedStatusMsg
        })}
      />
      <p style={{ fontSize: '1.3rem', marginTop: '0.5rem' }}>
        {renderCharLimit({
          contentType: 'statusMsg',
          text: editedStatusMsg
        })}
      </p>
      {editedStatusMsg && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            marginTop: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ColorSelector
              colors={[
                'rose',
                'pink',
                'ivory',
                'logoGreen',
                'logoBlue',
                'menuGray',
                'black'
              ]}
              twinkleXP={profile.twinkleXP || 0}
              setColor={setColor}
              selectedColor={statusColor}
            />
          </div>
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Button snow onClick={onCancel} style={{ fontSize: '1rem' }}>
              Cancel
            </Button>
            <Button
              primary
              filled
              disabled={
                !!exceedsCharLimit({
                  contentType: 'statusMsg',
                  text: editedStatusMsg
                })
              }
              style={{ marginLeft: '1rem', fontSize: '1rem' }}
              onClick={onStatusSubmit}
            >
              Enter
            </Button>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
