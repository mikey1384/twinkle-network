import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QuestionsListItem from './QuestionsListItem'
import RoundList from 'components/RoundList'
import Button from 'components/Button'
import { Color } from 'constants/css'

export default class QuestionsListGroup extends Component {
  static propTypes = {
    questionIds: PropTypes.array.isRequired,
    questions: PropTypes.object.isRequired,
    onReorderDone: PropTypes.func.isRequired,
    onReorderCancel: PropTypes.func.isRequired
  }

  state = {
    questionIds: []
  }

  componentDidMount() {
    this.setState({
      questionIds: this.props.questionIds
    })
  }

  render() {
    const { questions } = this.props
    const { questionIds } = this.state
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h3 style={{ color: Color.darkGray() }}>Reorder Questions</h3>
        <RoundList style={{ marginTop: '2rem' }}>
          {questionIds.map((questionId, index) => (
            <QuestionsListItem
              key={index}
              item={questions[questionId]}
              questionId={Number(questionId)}
              onMove={this.onMove}
            />
          ))}
        </RoundList>
        <div style={{ marginTop: '2rem', display: 'flex' }}>
          <Button
            transparent
            style={{ marginRight: '1rem' }}
            onClick={() => this.onReorderCancel()}
          >
            Cancel
          </Button>
          <Button primary onClick={() => this.onReorderDone()}>
            Done
          </Button>
        </div>
      </div>
    )
  }

  onMove = ({ sourceId, targetId }) => {
    const newIndices = [...this.state.questionIds]
    const sourceIndex = newIndices.indexOf(sourceId)
    const targetIndex = newIndices.indexOf(targetId)
    newIndices.splice(sourceIndex, 1)
    newIndices.splice(targetIndex, 0, sourceId)
    this.setState({ questionIds: newIndices })
  }

  onReorderDone = () => {
    const { onReorderDone } = this.props
    const { questionIds } = this.state
    onReorderDone(questionIds)
  }

  onReorderCancel = () => {
    const { onReorderCancel } = this.props
    onReorderCancel()
  }
}
