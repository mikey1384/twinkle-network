import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SubjectInputForm from './SubjectInputForm';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { charLimit } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';
import { Color } from 'constants/css';

StartNewSubjectPanel.propTypes = {
  onUploadSubject: PropTypes.func.isRequired,
  contentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  contentType: PropTypes.string.isRequired
};

export default function StartNewSubjectPanel({
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
  const {
    state,
    actions: { onSetSubjectFormShown }
  } = useContentContext();
  const contentState = state[contentType + contentId] || {};
  const { subjectFormShown } = contentState;
  return useMemo(
    () => (
      <div
        style={{
          background: '#fff',
          border: `1px solid ${Color.borderGray()}`,
          fontSize: '1.5rem',
          marginTop: '1rem'
        }}
      >
        <div style={{ padding: '1rem' }}>
          {subjectFormShown ? (
            <div>
              <SubjectInputForm
                contentId={contentId}
                contentType={contentType}
                canEditRewardLevel={canEditRewardLevel}
                isSubject
                autoFocus
                onSubmit={onSubmit}
                onClose={() =>
                  onSetSubjectFormShown({
                    contentId,
                    contentType,
                    shown: false
                  })
                }
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
                onClick={() =>
                  onSetSubjectFormShown({ contentId, contentType, shown: true })
                }
              >
                <Icon icon="comment-alt" />
                <span style={{ marginLeft: '1rem' }}>Start a New Subject</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    ),
    [subjectFormShown, canEditRewardLevel, profileTheme]
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
    onSetSubjectFormShown({ contentId, contentType, shown: false });
    onUploadSubject({ ...data, contentType, contentId });
  }
}
