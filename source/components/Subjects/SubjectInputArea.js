import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TitleDescriptionForm from 'components/Forms/TitleDescriptionForm';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { uploadSubject } from 'helpers/requestHelpers';
import { charLimit } from 'constants/defaultValues';
import { connect } from 'react-redux';

SubjectInputArea.propTypes = {
  onUploadSubject: PropTypes.func.isRequired,
  contentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  dispatch: PropTypes.func.isRequired,
  profileTheme: PropTypes.string,
  type: PropTypes.string.isRequired
};

function SubjectInputArea({
  contentId,
  dispatch,
  onUploadSubject,
  profileTheme,
  type
}) {
  const [subjectFormShown, setSubjectFormShown] = useState(false);
  const themeColor = profileTheme || 'logoBlue';
  return (
    <div
      style={{
        background: '#fff',
        fontSize: '1.5rem',
        marginTop: '1rem'
      }}
    >
      <div style={{ padding: '1rem' }}>
        {subjectFormShown ? (
          <TitleDescriptionForm
            isSubject
            autoFocus
            onSubmit={onSubmit}
            onClose={() => setSubjectFormShown(false)}
            rows={4}
            titleMaxChar={charLimit.subject.title}
            descriptionMaxChar={charLimit.subject.description}
            titlePlaceholder="Enter Subject..."
            descriptionPlaceholder="Enter Details... (Optional)"
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              skeuomorphic
              color={themeColor}
              style={{ fontSize: '2rem' }}
              onClick={() => setSubjectFormShown(true)}
            >
              <Icon icon="comment-alt" />
              <span style={{ marginLeft: '1rem' }}>Start a New Subject</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  async function onSubmit({ title, description, secretAnswer }) {
    const data = await uploadSubject({
      title,
      description,
      dispatch,
      contentId,
      secretAnswer,
      type
    });
    setSubjectFormShown(false);
    onUploadSubject(data);
  }
}

export default connect(
  state => ({
    profileTheme: state.UserReducer.profileTheme
  }),
  dispatch => ({ dispatch })
)(SubjectInputArea);
