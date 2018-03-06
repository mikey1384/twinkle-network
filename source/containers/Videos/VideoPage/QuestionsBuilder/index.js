import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Modal from 'components/Modal'
import QuestionBlock from './QuestionBlock'
import ButtonGroup from 'components/ButtonGroup'
import Button from 'components/Button'
import HTML5Backend from 'react-dnd-html5-touch-backend'
import { DragDropContext } from 'react-dnd'
import QuestionsListGroup from './QuestionsListGroup'

class QuestionsBuilder extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    videoCode: PropTypes.string.isRequired
  }

  state = {
    reorderModeOn: false,
    questions: [],
    editedQuestionOrder: []
  }

  componentWillMount() {
    this.setState({
      editedQuestionOrder: this.state.questions.map(question => {
        return question.id
      })
    })
  }

  render() {
    const { reorderModeOn, questions, editedQuestionOrder } = this.state
    const { title } = this.props
    const topButtons = [
      {
        label: '+ Add',
        onClick: this.onAddQuestion,
        buttonClass: 'btn-primary'
      },
      {
        label: 'Reorder',
        onClick: () =>
          this.setState({
            reorderModeOn: true,
            interfaceMarginTop: 0
          }),
        buttonClass: 'btn-info'
      },
      {
        label: 'Reset',
        onClick: this.onReset,
        buttonClass: 'btn-warning'
      }
    ]
    return (
      <Modal large onHide={this.props.onHide}>
        <header>{title}</header>
        <main>
          {reorderModeOn && (
            <QuestionsListGroup
              questions={questions}
              questionIds={editedQuestionOrder}
              style={{
                cursor: 'ns-resize'
              }}
              onMove={this.onQuestionsRearrange}
            />
          )}
          {!reorderModeOn &&
            questions.map((question, index) => {
              return (
                <div key={index}>
                  {question.errorMessage && (
                    <span style={{ color: 'red' }}>
                      {question.errorMessage}
                    </span>
                  )}
                  <QuestionBlock
                    {...question}
                    questionIndex={index}
                    inputType="radio"
                    onSelectChoice={this.onSelectChoice}
                    onRearrange={this.onChoicesRearrange}
                    onRemove={this.onRemoveQuestion}
                    onUndoRemove={this.onUndoRemove}
                    onEditStart={questionIndex => {
                      const newQuestions = this.state.questions.map(
                        (question, index) => {
                          if (index === questionIndex) {
                            question.onEdit = true
                          }
                          return question
                        }
                      )
                      this.setState({ questions: newQuestions })
                    }}
                    onEditCancel={questionIndex => {
                      const newQuestions = this.state.questions.map(
                        (question, index) => {
                          if (index === questionIndex) {
                            question.onEdit = false
                          }
                          return question
                        }
                      )
                      this.setState({ questions: newQuestions })
                    }}
                    onEditDone={params => this.onChoiceEditDone(params)}
                  />
                </div>
              )
            })}
          <div>
            <iframe
              frameBorder="0"
              allowFullScreen="1"
              title={this.props.title}
              width="640"
              height="360"
              src={`https://www.youtube.com/embed/${this.props.videoCode}`}
            />
            <div>
              {reorderModeOn ? (
                <div>
                  <Button primary onClick={() => this.onReorderDone()}>
                    Done
                  </Button>
                  <Button onClick={() => this.onReorderCancel()}>Cancel</Button>
                </div>
              ) : (
                <div>
                  <ButtonGroup buttons={topButtons} />
                  <div>
                    <Button onClick={() => this.onSubmit()}>Submit</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </Modal>
    )
  }

  onAddQuestion = () => {
    const questions = this.state.questions
    const newQuestions = questions.concat([
      {
        title: undefined,
        id: questions.length,
        onEdit: true,
        choices: [
          {
            label: '',
            checked: false,
            id: 0
          },
          {
            label: '',
            checked: false,
            id: 1
          },
          {
            label: '',
            checked: false,
            id: 2
          },
          {
            label: '',
            checked: false,
            id: 3
          },
          {
            label: '',
            checked: false,
            id: 4
          }
        ],
        errorMessage: null,
        deleted: false
      }
    ])
    this.setState({
      questions: newQuestions,
      editedQuestionOrder: newQuestions.map(question => {
        return question.id
      })
    })
  }

  onRemoveQuestion = questionIndex => {
    this.setState({
      questions: this.state.questions.map((question, index) => {
        if (index === questionIndex) {
          question.deleted = true
          question.errorMessage = null
        }
        return question
      })
    })
  }

  onUndoRemove = questionIndex => {
    this.setState({
      questions: this.state.questions.map((question, index) => {
        if (index === questionIndex) {
          question.deleted = false
        }
        return question
      })
    })
  }

  onChoiceEditDone = ({ questionIndex, newChoicesArray, newTitle }) => {
    const newQuestion = this.state.questions[questionIndex]
    newQuestion.choices = newChoicesArray
    newQuestion.title = newTitle
    newQuestion.onEdit = false
    newQuestion.errorMessage = null

    const newQuestions = this.state.questions.map((question, index) => {
      if (index === questionIndex) {
        question = newQuestion
      }
      return question
    })
    this.setState({
      questions: newQuestions
    })
  }

  onReorderCancel = () => {
    this.setState({
      editedQuestionOrder: this.state.questions.map(question => {
        return question.id
      }),
      reorderModeOn: false
    })
  }

  onQuestionsRearrange = ({ sourceId, targetId }) => {
    const newQuestionOrder = this.state.editedQuestionOrder
    const sourceIndex = newQuestionOrder.indexOf(sourceId)
    const targetIndex = newQuestionOrder.indexOf(targetId)
    newQuestionOrder.splice(sourceIndex, 1)
    newQuestionOrder.splice(targetIndex, 0, sourceId)
    this.setState({
      editedQuestionOrder: newQuestionOrder
    })
  }

  onReorderDone = () => {
    const newQuestions = this.state.editedQuestionOrder.reduce(
      (result, questionId) => {
        for (let i = 0; i < this.state.questions.length; i++) {
          if (this.state.questions[i].id === questionId) {
            result.push(this.state.questions[i])
          }
        }
        return result
      },
      []
    )
    this.setState({
      questions: newQuestions,
      reorderModeOn: false
    })
  }

  onSelectChoice = (questionIndex, choiceIndex) => {
    this.setState({
      questions: this.state.questions.map((question, index) => {
        if (index === questionIndex) {
          for (let i = 0; i < question.choices.length; i++) {
            question.choices[i].checked = i === choiceIndex
          }
          question.errorMessage = null
        }
        return question
      })
    })
  }

  onChoicesRearrange = ({ questionIndex, choiceIndices }) => {
    const newQuestions = this.state.questions.map((question, index) => {
      if (index === questionIndex) {
        const newChoices = choiceIndices.reduce((result, choiceId) => {
          for (let i = 0; i < question.choices.length; i++) {
            if (question.choices[i].id === choiceId) {
              result.push(question.choices[i])
            }
          }
          return result
        }, [])
        question.choices = newChoices
      }
      return question
    })
    this.setState({ questions: newQuestions })
  }

  onReset() {
    console.log('reset')
  }

  onSubmit = () => {
    let firstError = null
    const questions = [...this.state.questions]
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].deleted) {
        if (!questions[i].title || questions[i].title === '') {
          if (firstError === null) firstError = questions[i].id
          questions[i].errorMessage = 'Please enter title'
        } else if (errorInQuestionChoices(questions[i])) {
          if (firstError === null) firstError = questions[i].id
          questions[i].errorMessage = errorInQuestionChoices(questions[i])
        }
      }
    }

    if (firstError !== null) {
      this.Questions[firstError].scrollIntoView()
      this.setState({ questions })
    } else {
      const finishedQuestions = questions.filter(question => {
        return !question.deleted
      })
      this.props.onSubmit(finishedQuestions)
    }

    function errorInQuestionChoices(question) {
      let validCheckExists = false
      const validChoices = question.choices.filter(
        choice => choice.label && choice.label !== ''
      )
      if (validChoices.length < 2) {
        return 'There must be at least 2 choices.'
      }
      for (let i = 0; i < validChoices.length; i++) {
        if (validChoices[i].checked) {
          validCheckExists = true
        }
      }
      if (!validCheckExists) {
        return 'Please mark the correct choice.'
      }
      return false
    }
  }
}

export default DragDropContext(HTML5Backend)(QuestionsBuilder)
