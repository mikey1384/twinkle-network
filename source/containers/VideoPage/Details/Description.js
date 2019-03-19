import React from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import LongText from 'components/Texts/LongText';
import Button from 'components/Button';
import { renderCharLimit, stringIsEmpty } from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';

Description.propTypes = {
  description: PropTypes.string.isRequired,
  descriptionExceedsCharLimit: PropTypes.func.isRequired,
  determineEditButtonDoneStatus: PropTypes.func.isRequired,
  editedDescription: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
  onEdit: PropTypes.bool.isRequired,
  onEditCancel: PropTypes.func.isRequired,
  onEditFinish: PropTypes.func.isRequired
};

export default function Description({
  description,
  descriptionExceedsCharLimit,
  determineEditButtonDoneStatus,
  editedDescription,
  onChange,
  onKeyUp,
  onEdit,
  onEditCancel,
  onEditFinish
}) {
  return (
    <div>
      {onEdit ? (
        <>
          <Textarea
            minRows={5}
            placeholder={edit.description}
            value={editedDescription}
            onChange={onChange}
            onKeyUp={onKeyUp}
            style={{
              marginTop: '1rem',
              ...descriptionExceedsCharLimit(editedDescription)
            }}
          />
          {descriptionExceedsCharLimit(editedDescription) && (
            <small style={{ color: 'red' }}>
              {renderCharLimit({
                contentType: 'video',
                inputType: 'description',
                text: editedDescription
              })}
            </small>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem'
            }}
          >
            <Button
              transparent
              style={{ fontSize: '1.7rem', marginRight: '1rem' }}
              onClick={onEditCancel}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              disabled={determineEditButtonDoneStatus()}
              onClick={onEditFinish}
              style={{ fontSize: '1.7rem' }}
            >
              Done
            </Button>
          </div>
        </>
      ) : (
        <LongText
          style={{
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            fontSize: '1.6rem',
            padding: '1rem 0',
            lineHeight: '2.3rem'
          }}
        >
          {stringIsEmpty(description) ? 'No Description' : description}
        </LongText>
      )}
    </div>
  );
}
