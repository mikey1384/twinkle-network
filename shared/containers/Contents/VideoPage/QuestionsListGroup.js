import React, { Component } from 'react';
import QuestionsListItem from './QuestionsListItem';


export default class SortableListGroup extends Component {
  render() {
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
        {...this.props}
      >
        {
          listItems.map((item, index) => {
            return (
              <QuestionsListItem
                key={index}
                item={item}
                onMove={({sourceId, targetId}) => this.props.onMove({sourceId, targetId})}
              />
            )
          })
        }
      </ul>
    )
  }
}
