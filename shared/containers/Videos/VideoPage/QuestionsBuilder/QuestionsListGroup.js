import React from 'react';
import QuestionsListItem from './QuestionsListItem';

export default function QuestionsListGroup({questions, questionIds, style, onMove}) {
  const listItems = questionIds.map(questionId => {
    for (let i = 0; i < questions.length; i ++) {
      if (questions[i].id === questionId) {
        return {
          label: questions[i].title,
          id: questionId,
          deleted: questions[i].deleted
        }
      }
    }
  })
  return (
    <ul
      className="list-group unselectable"
      style={style}
    >
      {listItems.map((item, index) => (
        <QuestionsListItem
          key={index}
          item={item}
          onMove={({sourceId, targetId}) => onMove({sourceId, targetId})}
        />
      ))}
    </ul>
  )
}
