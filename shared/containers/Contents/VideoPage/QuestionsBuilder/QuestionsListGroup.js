import React from 'react';
import QuestionsListItem from './QuestionsListItem';

export default function SortableListGroup(props) {
  const { questions, questionIds } = this.props;
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
      {...props}
    >
      {listItems.map((item, index) => (
        <QuestionsListItem
          key={index}
          item={item}
          onMove={({sourceId, targetId}) => props.onMove({sourceId, targetId})}
        />
      ))}
    </ul>
  )
}
