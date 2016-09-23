import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal} from 'react-bootstrap';
import QuestionBlock from './QuestionBlock';
import ButtonGroup from 'components/ButtonGroup';
import Button from 'components/Button';
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd';
import QuestionsListGroup from './QuestionsListGroup';
import {connect} from 'react-redux';


const defaultChoices = () => [
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
]

const defaultState = props => ({
  questions: props.questions.length === 0 ? [
    {
      title: '',
      id: 0,
      onEdit: true,
      choices: defaultChoices(),
      errorMessage: '',
      deleted: false
    }
  ] : props.questions.map((question, index) => {
    return {
      title: question.title,
      id: index,
      onEdit: false,
      choices: question.choices.map((choice, index) => {
        return {
          label: choice,
          checked: index + 1 === question.correctChoice,
          id: index
        }
      }),
      errorMessage: '',
      deleted: false
    }
  }),
  interfaceMarginTop: 0,
  editedQuestionOrder: [],
  reorderModeOn: false
})

@DragDropContext(HTML5Backend)
export default class QuestionsBuilder extends Component {
  constructor(props) {
    super()
    this.state = defaultState(props);
    this.onAddQuestion = this.onAddQuestion.bind(this)
    this.onRemoveQuestion = this.onRemoveQuestion.bind(this)
    this.onUndoRemove = this.onUndoRemove.bind(this)
    this.onQuestionsRearrange = this.onQuestionsRearrange.bind(this)
    this.onSelectChoice = this.onSelectChoice.bind(this)
    this.onChoicesRearrange = this.onChoicesRearrange.bind(this)
    this.onReset = this.onReset.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentWillMount() {
    this.setState({editedQuestionOrder: this.state.questions.map(question => {
      return question.id
    })})
  }

  render() {
    const {reorderModeOn, questions, editedQuestionOrder} = this.state;
    const {title} = this.props;
    const topButtons = [
      {
        label: "+ Add",
        onClick: this.onAddQuestion,
        buttonClass: "btn-primary"
      },
      {
        label: "Reorder",
        onClick: () => this.setState({
          reorderModeOn: true,
          interfaceMarginTop: 0
        }),
        buttonClass: "btn-info"
      },
      {
        label: "Reset",
        onClick: this.onReset,
        buttonClass: "btn-warning"
      }
    ]
    return (
      <Modal
        show
        onHide={this.props.onHide}
        animation={false}
        backdrop="static"
        dialogClassName="modal-extra-lg"
        onScroll={this.handleScroll}
      >
        <Modal.Header closeButton>
          <h2 className="text-center">{title}</h2>
        </Modal.Header>
        <Modal.Body>
          <div
            className="row"
            style={{paddingBottom: '2em'}}
          >
            <div
              className="col-sm-5"
              style={{marginLeft: '3%'}}
            >
              {reorderModeOn &&
                <QuestionsListGroup
                  questions={questions}
                  questionIds={editedQuestionOrder}
                  style={{
                    paddingTop: '1em',
                    cursor: 'ns-resize'
                  }}
                  onMove={this.onQuestionsRearrange}
                />
              }
              {!reorderModeOn &&
                questions.map((question, index) => {
                  return (
                    <div
                      key={index}
                      ref={question.id}
                      style={{
                        paddingTop: index === 0 ? '1em' : '3em'
                      }}
                    >
                      {question.errorMessage &&
                        <span className="error-detected">
                          {question.errorMessage}
                        </span>
                      }
                      <QuestionBlock
                        {...question}
                        questionIndex={index}
                        inputType="radio"
                        onSelectChoice={this.onSelectChoice}
                        onRearrange={this.onChoicesRearrange}
                        onRemove={this.onRemoveQuestion}
                        onUndoRemove={this.onUndoRemove}
                        onEditStart={
                          questionIndex => {
                            const newQuestions = this.state.questions.map((question, index) => {
                              if (index === questionIndex) {
                                question.onEdit = true;
                              }
                              return question;
                            })
                            this.setState({questions: newQuestions})
                          }
                        }
                        onEditCancel={
                          questionIndex => {
                            const newQuestions = this.state.questions.map((question, index) => {
                              if (index === questionIndex) {
                                question.onEdit = false;
                              }
                              return question;
                            })
                            this.setState({questions: newQuestions})
                          }
                        }
                        onEditDone={params => this.onChoiceEditDone(params)}
                      />
                    </div>
                  )
                })
              }
            </div>
            <div
              className="col-sm-6 pull-right"
              style={{
                paddingTop: `${15 + this.state.interfaceMarginTop}px`,
                paddingBottom: '1em',
                marginRight: '3%'
              }}
            >
              <div
                className="embed-responsive embed-responsive-16by9"
              >
                <iframe
                  className="embed-responsive-item"
                  frameBorder="0"
                  allowFullScreen="1"
                  title={this.props.title}
                  width="640"
                  height="360"
                  src={`https://www.youtube.com/embed/${this.props.videoCode}`}>
                </iframe>
              </div>
              <div
                className="text-center"
                style={{marginTop: '1em'}}
              >
                {reorderModeOn ?
                  <div>
                    <Button
                      className="btn btn-primary"
                      style={{
                        marginRight: '0.5em'
                      }}
                      onClick={() => this.onReorderDone()}
                    >
                      Done
                    </Button>
                    <Button
                      className="btn btn-default"
                      onClick={() => this.onReorderCancel()}
                    >
                      Cancel
                    </Button>
                  </div> :
                  <div>
                    <ButtonGroup
                      buttons={topButtons}
                    />
                    <div style={{marginTop: '1em'}}>
                      <Button
                        className="btn btn-success col-sm-2 col-sm-offset-5"
                        onClick={ () => this.onSubmit() }
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  onAddQuestion() {
    const questions = this.state.questions;
    const newQuestions = questions.concat([{
      title: undefined,
      id: questions.length,
      onEdit: true,
      choices: defaultChoices(),
      errorMessage: null,
      deleted: false
    }]);
    this.setState({
      questions: newQuestions,
      editedQuestionOrder: newQuestions.map(question => {
        return question.id
      })
    }, () => {
      ReactDOM.findDOMNode(this.refs[questions[questions.length-1].id]).scrollIntoView();
    })
  }

  onRemoveQuestion(questionIndex) {
    this.setState({
      questions: this.state.questions.map((question, index) => {
        if (index === questionIndex) {
          question.deleted = true;
          question.errorMessage = null;
        }
        return question;
      })
    })
  }

  onUndoRemove(questionIndex) {
    this.setState({questions: this.state.questions.map((question, index) => {
      if (index === questionIndex) {
        question.deleted = false;
      }
      return question;
    })})
  }

  onChoiceEditDone({questionIndex, newChoicesArray, newTitle}) {
    const newQuestion = this.state.questions[questionIndex];
    newQuestion.choices = newChoicesArray;
    newQuestion.title = newTitle;
    newQuestion.onEdit = false;
    newQuestion.errorMessage = null;

    const newQuestions = this.state.questions.map((question, index) => {
      if (index === questionIndex) {
        question = newQuestion;
      }
      return question;
    })
    this.setState({
      questions: newQuestions
    })
  }

  onReorderCancel() {
    this.setState({
      editedQuestionOrder: this.state.questions.map(question => {
        return question.id
      }),
      reorderModeOn: false
    })
  }

  onQuestionsRearrange({sourceId, targetId}) {
    const newQuestionOrder = this.state.editedQuestionOrder;
    const sourceIndex = newQuestionOrder.indexOf(sourceId);
    const targetIndex = newQuestionOrder.indexOf(targetId);
    newQuestionOrder.splice(sourceIndex, 1);
    newQuestionOrder.splice(targetIndex, 0, sourceId);
    this.setState({
      editedQuestionOrder: newQuestionOrder
    })
  }

  onReorderDone() {
    const newQuestions = this.state.editedQuestionOrder.map(questionId => {
      for (let i = 0; i < this.state.questions.length; i++) {
        if (this.state.questions[i].id === questionId) {
          return this.state.questions[i]
        }
      }
    })
    this.setState({
      questions: newQuestions,
      reorderModeOn: false
    })
  }

  onSelectChoice(questionIndex, choiceIndex) {
    this.setState({
      questions: this.state.questions.map((question, index) => {
        if (index === questionIndex) {
          question.choices.map((choice, index) => {
            index === choiceIndex ? choice.checked = true : choice.checked = false
          })
          question.errorMessage = null;
        }
        return question;
      })
    })
  }

  onChoicesRearrange({questionIndex, choiceIndices}) {
    const newQuestions = this.state.questions.map((question, index) => {
      if (index === questionIndex) {
        const newChoices = choiceIndices.map(choiceId => {
          for (let i = 0; i < question.choices.length; i ++) {
            if (question.choices[i].id === choiceId) {
              return question.choices[i]
            }
          }
        })
        question.choices = newChoices;
      }
      return question;
    })
    this.setState({questions: newQuestions})
  }

  handleScroll(event) {
    const scrollTop = event.target.scrollTop;
    this.setState({interfaceMarginTop: scrollTop})
  }

  onReset() {
    this.setState(defaultState(this.props), () =>
    this.setState({editedQuestionOrder: this.state.questions.map(question => {
      return question.id
    })}))
  }

  onSubmit() {
    let firstError = null;
    const questions = [...this.state.questions];
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].deleted) {
        if (!questions[i].title || questions[i].title === '') {
          if (firstError === null) firstError = questions[i].id;
          questions[i].errorMessage = "Please enter title";
        }
        else if (errorInQuestionChoices(questions[i])) {
          if (firstError === null) firstError = questions[i].id;
          questions[i].errorMessage = errorInQuestionChoices(questions[i]);
        }
      }
    }

    if (firstError !== null) {
      ReactDOM.findDOMNode(this.refs[firstError]).scrollIntoView();
      this.setState({questions})
    }
    else {
      const finishedQuestions = questions.filter(question => {
        return !question.deleted;
      })
      this.props.onSubmit(finishedQuestions);
    }

    function errorInQuestionChoices(question) {
      let validCheckExists = false;
      const validChoices = question.choices.filter(choice => choice.label && choice.label !== '')
      if (validChoices.length < 2) {
        return "There must be at least 2 choices.";
      }
      for (let i = 0; i < validChoices.length; i ++) {
        if (validChoices[i].checked) {
          validCheckExists = true;
        }
      }
      if (!validCheckExists) {
        return "Please mark the correct choice.";
      }
      return false;
    }
  }
}
