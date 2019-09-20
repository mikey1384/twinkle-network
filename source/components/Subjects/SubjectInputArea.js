import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TitleDescriptionForm from 'components/Forms/TitleDescriptionForm';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { charLimit } from 'constants/defaultValues';
import { useAppContext } from 'context';

SubjectInputArea.propTypes = {
  onUploadSubject: PropTypes.func.isRequired,
  contentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  contentType: PropTypes.string.isRequired
};

export default function SubjectInputArea({
  contentId,
  contentType,
  onUploadSubject
}) {
  const {
    user: {
      state: { canEditRewardLevel, profileTheme }
    },
    requestHelpers: { uploadSubject }
  } = useAppContext();
  const [subjectFormShown, setSubjectFormShown] = useState(false);
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
          <div>
            <TitleDescriptionForm
              canEditRewardLevel={canEditRewardLevel}
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
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              skeuomorphic
              color={profileTheme}
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

  async function onSubmit({ title, description, rewardLevel, secretAnswer }) {
    const data = await uploadSubject({
      title,
      description,
      contentId,
      rewardLevel,
      secretAnswer,
      contentType
    });
    setSubjectFormShown(false);
    onUploadSubject({ ...data, contentType, contentId });
  }
}
