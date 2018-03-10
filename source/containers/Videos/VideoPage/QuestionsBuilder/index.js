import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Modal from 'components/Modal'
import QuestionBlock from './QuestionBlock'
import ButtonGroup from 'components/ButtonGroup'
import Button from 'components/Button'
import QuestionsListGroup from './QuestionsListGroup'
import { stringIsEmpty } from 'helpers/stringHelpers'
import YouTube from 'react-youtube'
import { css } from 'emotion'
import HTML5Backend from 'react-dnd-html5-touch-backend'
import { DragDropContext } from 'react-dnd'

class QuestionsBuilder extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    videoCode: PropTypes.string.isRequired
  }

  state = {
    reorderModeOn: false,
    questions: {},
    questionIds: []
  }

  Questions = []

  componentWillMount() {
    const { questions } = this.props
    this.setState({
      questions:
        questions.length !== 0
          ? this.formatQuestions(questions)
          : this.newQuestion(questions),
      questionIds:
        questions.length > 0 ? questions.map((question, index) => index) : [0]
    })
  }

  render() {
    const { reorderModeOn, questions, questionIds } = this.state
    const { title, videoCode } = this.props
    return (
      <Modal large onHide={this.props.onHide}>
        <header>{title}</header>
        <main
          style={{
            flexDirection: 'row',
            justifyContent: reorderModeOn ? 'center' : 'space-between',
            alignItems: 'center',
            width: '100%',
            height: 'CALC(100vh - 21rem)'
          }}
        >
          <section
            className={this.Styles.leftSection}
            style={{
              width: reorderModeOn && '80%'
            }}
          >
            {reorderModeOn ? (
              <QuestionsListGroup
                questions={questions}
                questionIds={questionIds}
                onMove={this.onQuestionsRearrange}
                onReorderDone={questionIds =>
                  this.setState({ questionIds, reorderModeOn: false })
                }
                onReorderCancel={() => this.setState({ reorderModeOn: false })}
              />
            ) : questionIds.length > 0 ? (
              questionIds.map((questionId, index) => {
                const question = questions[questionId]
                return (
                  <div key={index}>
                    <QuestionBlock
                      {...question}
                      id={Number(questionId)}
                      hideErrorMsg={id =>
                        this.setState(state => ({
                          questions: {
                            ...state.questions,
                            [id]: {
                              ...state.questions[id],
                              errorMessage: ''
                            }
                          }
                        }))
                      }
                      questionIndex={index}
                      errorMessage={question.errorMessage}
                      innerRef={ref => {
                        this.Questions[questionId] = ref
                      }}
                      onSelectChoice={this.onSelectChoice}
                      onRearrange={this.onChoicesRearrange}
                      onRemove={this.onRemoveQuestion}
                      onUndoRemove={this.onUndoRemove}
                      onEditStart={questionIndex => {
                        this.setState(state => ({
                          questions: {
                            ...state.questions,
                            [questionIndex]: {
                              ...state.questions[questionIndex],
                              onEdit: true
                            }
                          }
                        }))
                      }}
                      onEditCancel={questionIndex => {
                        this.setState(state => ({
                          questions: {
                            ...state.questions,
                            [questionIndex]: {
                              ...state.questions[questionIndex],
                              onEdit: false
                            }
                          }
                        }))
                      }}
                      onEditDone={this.onChoiceEditDone}
                    />
                  </div>
                )
              })
            ) : null}
          </section>
          {!reorderModeOn && (
            <section className={this.Styles.rightSection}>
              <div className={this.Styles.videoContainer}>
                <div className={this.Styles.videoWrapper}>
                  <YouTube
                    className={this.Styles.YouTube}
                    videoId={videoCode}
                  />
                </div>
                <div className={this.Styles.videoInterface}>
                  <ButtonGroup
                    buttons={[
                      {
                        label: '+ Add',
                        filled: true,
                        onClick: this.onAddQuestion,
                        buttonClass: 'success'
                      },
                      {
                        label: 'Reorder',
                        filled: true,
                        onClick: () =>
                          this.setState({
                            reorderModeOn: true,
                            interfaceMarginTop: 0
                          }),
                        buttonClass: 'info'
                      },
                      {
                        label: 'Reset',
                        filled: true,
                        onClick: this.onReset,
                        buttonClass: 'warning'
                      }
                    ]}
                  />
                  <div
                    style={{
                      marginTop: '1rem',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Button
                      primary
                      filled
                      onClick={this.onSubmit}
                      style={{ fontSize: '2rem' }}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </Modal>
    )
  }

  onAddQuestion = () => {
    this.setState(state => {
      let newQuestionId
      const newQuestionObject = this.newQuestion(state.questions)
      for (let key in newQuestionObject) {
        newQuestionId = key
      }
      return {
        questions: {
          ...state.questions,
          ...newQuestionObject
        },
        questionIds: state.questionIds.concat(Number(newQuestionId))
      }
    })
  }

  onRemoveQuestion = questionId => {
    this.setState(state => ({
      questions: {
        ...state.questions,
        [questionId]: {
          ...state.questions[questionId],
          deleted: true
        }
      }
    }))
  }

  onUndoRemove = questionId => {
    this.setState(state => ({
      questions: {
        ...state.questions,
        [questionId]: {
          ...state.questions[questionId],
          deleted: false
        }
      }
    }))
  }

  onChoiceEditDone = ({ id, choices, choiceIds, editedQuestionTitle }) => {
    this.setState(state => ({
      questions: {
        ...state.questions,
        [id]: {
          ...state.questions[id],
          choices: choiceIds.map(choiceId => choices[choiceId]),
          title: editedQuestionTitle,
          onEdit: false
        }
      }
    }))
  }

  onQuestionsRearrange = ({ sourceId, targetId }) => {
    const newQuestionOrder = [...this.state.questionIds]
    const sourceIndex = newQuestionOrder.indexOf(sourceId)
    const targetIndex = newQuestionOrder.indexOf(targetId)
    newQuestionOrder.splice(sourceIndex, 1)
    newQuestionOrder.splice(targetIndex, 0, sourceId)
    this.setState({
      questionIds: newQuestionOrder
    })
  }

  onSelectChoice = ({ questionId, choiceId }) => {
    this.setState(state => ({
      questions: {
        ...state.questions,
        [questionId]: {
          ...state.questions[questionId],
          errorMessage: '',
          choices: state.questions[questionId].choices.map(choice => ({
            ...choice,
            checked: choice.id === choiceId
          }))
        }
      }
    }))
  }

  onChoicesRearrange = ({ questionIndex, choiceIds, choices }) => {
    this.setState(state => ({
      questions: {
        ...state.questions,
        [state.questionIds[questionIndex]]: {
          ...state.questions[state.questionIds[questionIndex]],
          choices: choiceIds.map(choiceId => choices[choiceId])
        }
      }
    }))
  }

  onReset = () => {
    const { questions } = this.props
    this.setState({
      questions:
        questions.length !== 0
          ? this.formatQuestions(questions)
          : this.newQuestion(questions),
      questionIds:
        questions.length > 0 ? questions.map(question => question.id) : [0]
    })
  }

  onSubmit = () => {
    const { questions, questionIds } = this.state
    const { onSubmit } = this.props
    let errorObj = {
      message: '',
      questionId: null
    }
    for (let i = 0; i < questionIds.length; i++) {
      if (!questions[i].deleted) {
        if (errorInQuestion(questions[i])) {
          errorObj = {
            message: errorInQuestion(questions[i]),
            questionId: i
          }
          break
        }
      }
    }

    if (errorObj.message) {
      return this.setState(
        state => ({
          questions: {
            ...state.questions,
            [errorObj.questionId]: {
              ...state.questions[errorObj.questionId],
              onEdit: true,
              errorMessage: errorObj.message
            }
          }
        }),
        () => {
          this.Questions[errorObj.questionId].scrollIntoView()
        }
      )
    }

    const finishedQuestions = questionIds
      .filter(questionId => !questions[questionId].deleted)
      .map(questionId => questions[questionId])
    onSubmit(finishedQuestions)

    function errorInQuestion(question) {
      if (question.onEdit) return 'Please click the "done" button below'
      if (!question.title || stringIsEmpty(question.title)) {
        return 'Please enter title'
      }
      const validChoices = question.choices.filter(choice => !!choice.label)
      if (validChoices.length < 2) {
        return 'There must be at least 2 choices.'
      }
      for (let i = 0; i < validChoices.length; i++) {
        if (validChoices[i].checked) {
          return false
        }
      }
      return 'Please mark the correct choice.'
    }
  }

  formatQuestions = questions => {
    let questionsObject = {}
    questions.forEach((question, index) => {
      questionsObject[index] = {
        title: question.title,
        onEdit: false,
        choices: question.choices.map((choice, index) => ({
          label: choice || '',
          checked: question.correctChoice
            ? index === question.correctChoice - 1
            : false,
          id: index
        })),
        errorMessage: '',
        deleted: false
      }
    })
    return questionsObject
  }

  newQuestion = questions => ({
    [Object.keys(questions).length]: {
      title: '',
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
      errorMessage: '',
      deleted: false
    }
  })

  Styles = {
    YouTube: css`
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1;
    `,
    leftSection: css`
      width: 40%;
      height: auto;
      max-height: 100%;
      padding: 1rem;
      overflow-y: scroll;
      padding-right: 2rem;
    `,
    rightSection: css`
      width: 60%;
      height: auto;
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
    `,
    videoContainer: css`
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      align-items: center;
    `,
    videoInterface: css`
      padding: 0 3rem;
      margin-top: 2rem;
    `,
    videoWrapper: css`
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
    `
  }
}

export default DragDropContext(HTML5Backend)(QuestionsBuilder)
