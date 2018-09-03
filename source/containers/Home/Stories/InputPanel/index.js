import React from 'react';
import ContentInput from './ContentInput';
import QuestionInput from './QuestionInput';

export default function InputPanel() {
  return (
    <div>
      <QuestionInput />
      <ContentInput />
    </div>
  );
}
