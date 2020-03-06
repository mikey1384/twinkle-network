import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectScreen from './SelectScreen';
import ErrorBoundary from 'components/ErrorBoundary';
import ClassroomChatForm from './ClassroomChatForm';
import RegularMenu from '../RegularMenu';

TeacherMenu.propTypes = {
  onCreateRegularChat: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function TeacherMenu({ onCreateRegularChat, onHide }) {
  const [section, setSection] = useState('select');
  return (
    <ErrorBoundary>
      {section === 'select' && (
        <SelectScreen onSetSection={setSection} onHide={onHide} />
      )}
      {section === 'regular' && (
        <RegularMenu
          onBackClick={() => setSection('select')}
          onDone={onCreateRegularChat}
          onHide={onHide}
        />
      )}
      {section === 'classroom' && (
        <ClassroomChatForm
          onBackClick={() => setSection('select')}
          onHide={onHide}
        />
      )}
    </ErrorBoundary>
  );
}
