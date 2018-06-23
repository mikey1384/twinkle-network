import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'
import Textarea from 'components/Texts/Textarea'
import ColorSelector from './ColorSelector'
import { css } from 'emotion'
import { Color } from 'constants/css'
import { exceedsCharLimit, renderCharLimit } from 'helpers/stringHelpers'

StatusInput.propTypes = {
  profile: PropTypes.object.isRequired,
  statusColor: PropTypes.string,
  editedStatusMsg: PropTypes.string,
  innerRef: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onStatusSubmit: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired
}
export default function StatusInput({
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
    <Fragment>
      <Textarea
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
      <p style={{ fontSize: '1.3rem' }}>
        {renderCharLimit({
          contentType: 'statusMsg',
          text: editedStatusMsg
        })}
      </p>
      {editedStatusMsg && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%'
          }}
        >
          <ColorSelector setColor={setColor} statusColor={statusColor} />
          <Button
            snow
            onClick={onCancel}
            style={{ marginLeft: '2rem', fontSize: '1rem' }}
          >
            Cancel
          </Button>
          <Button
            primary
            filled
            disabled={exceedsCharLimit({
              contentType: 'statusMsg',
              text: editedStatusMsg
            })}
            style={{ marginLeft: '1rem', fontSize: '1rem' }}
            onClick={onStatusSubmit}
          >
            Enter
          </Button>
        </div>
      )}
    </Fragment>
  )
}
