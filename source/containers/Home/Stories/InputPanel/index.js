import React from 'react';
import ContentInput from './ContentInput';
import SubjectInput from './SubjectInput';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';

export default function InputPanel() {
  return (
    <ErrorBoundary>
      <SubjectInput />
      <ContentInput />
    </ErrorBoundary>
  );
}
