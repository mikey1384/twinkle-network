import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import QuestionBlock from './QuestionBlock';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import Button from 'components/Button';
import QuestionsListGroup from './QuestionsListGroup';
import { isMobile } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import ReactPlayer from 'react-player';
import { css } from 'emotion';
import { DndProvider } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';

const Styles = {
  Player: css`
    position: absolute;
    top: 0;
    left: 0;
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
  `
};

QuestionsBuilder.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  videoCode: PropTypes.string.isRequired
};

export default function QuestionsBuilder({
  onHide,
  onSubmit,
  questions: initialQuestions,
  title,
  videoCode
}) {
  const [reorderModeOn, setReorderModeOn] = useState(false);
  const [questions, setQuestions] = useState({});
  const [questionIds, setQuestionIds] = useState([]);
  const LeftMenuRef = useRef(null);
  const QuestionBlocksRef = useRef(null);
  const QuestionsRef = useRef([]);

  useEffect(() => {
    setQuestions(
      initialQuestions.length !== 0
        ? formatQuestions(initialQuestions)
        : newQuestion(0)
    );
    setQuestionIds(
      initialQuestions.length > 0
        ? initialQuestions.map((question, index) => index)
        : [0]
    );
  }, []);
  const Backend = isMobile(navigator) ? TouchBackend : HTML5Backend;
  return (
    <DndProvider backend={Backend}>
      <Modal large onHide={onHide}>
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
            className={Styles.leftSection}
            ref={LeftMenuRef}
            style={{
              width: reorderModeOn && '80%'
            }}
          >
            {reorderModeOn ? (
              <QuestionsListGroup
                questions={questions}
                questionIds={questionIds}
                onMove={onQuestionsRearrange}
                onReorderDone={questionIds => {
                  setQuestionIds(questionIds);
                  setReorderModeOn(false);
                }}
                onReorderCancel={() => setReorderModeOn(false)}
              />
            ) : questionIds.length > 0 ? (
              <div ref={QuestionBlocksRef}>
                {questionIds.map((questionId, index) => {
                  const question = questions[questionId];
                  return (
                    <QuestionBlock
                      {...question}
                      key={index}
                      id={Number(questionId)}
                      hideErrorMsg={id => {
                        setQuestions({
                          ...questions,
                          [id]: {
                            ...questions[id],
                            errorMessage: ''
                          }
                        });
                      }}
                      questionIndex={index}
                      errorMessage={question.errorMessage}
                      innerRef={ref => {
                        QuestionsRef.current[questionId] = ref;
                      }}
                      onSelectChoice={onSelectChoice}
                      onRearrange={onChoicesRearrange}
                      onRemove={onRemoveQuestion}
                      onUndoRemove={onUndoRemove}
                      onEditStart={questionId => {
                        setQuestions({
                          ...questions,
                          [questionId]: {
                            ...questions[questionId],
                            onEdit: true
                          }
                        });
                      }}
                      onEditCancel={questionId => {
                        setQuestions({
                          ...questions,
                          [questionId]: {
                            ...questions[questionId],
                            errorMessage: '',
                            onEdit: false
                          }
                        });
                      }}
                      onEditDone={onChoiceEditDone}
                    />
                  );
                })}
              </div>
            ) : null}
          </section>
          {!reorderModeOn && (
            <section className={Styles.rightSection}>
              <div className={Styles.videoContainer}>
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${videoCode}`}
                  controls
                  width="100%"
                />
                <div className={Styles.videoInterface}>
                  <ButtonGroup
                    buttons={[
                      {
                        label: '+ Add',
                        filled: true,
                        onClick: onAddQuestion,
                        color: 'green'
                      },
                      {
                        label: 'Reorder',
                        filled: true,
                        onClick: () => setReorderModeOn(true),
                        color: 'lightBlue'
                      },
                      {
                        label: 'Reset',
                        filled: true,
                        onClick: onReset,
                        color: 'orange'
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
                      color="blue"
                      filled
                      onClick={handleSubmit}
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
    </DndProvider>
  );

  function onAddQuestion() {
    setQuestions({
      ...questions,
      ...newQuestion(Object.keys(questions).length)
    });
    setQuestionIds(questionIds.concat(Object.keys(questions).length));
    setTimeout(() => {
      LeftMenuRef.current.scrollTop = QuestionBlocksRef.current.offsetHeight;
    }, 0);
  }

  function onRemoveQuestion(questionId) {
    setQuestions({
      ...questions,
      [questionId]: {
        ...questions[questionId],
        errorMessage: '',
        deleted: true
      }
    });
  }

  function onUndoRemove(questionId) {
    setQuestions({
      ...questions,
      [questionId]: {
        ...questions[questionId],
        deleted: false
      }
    });
  }

  function onChoiceEditDone({ id, choices, choiceIds, editedQuestionTitle }) {
    setQuestions({
      ...questions,
      [id]: {
        ...questions[id],
        errorMessage: '',
        choices: choiceIds.map(choiceId => choices[choiceId]),
        title: editedQuestionTitle,
        onEdit: false
      }
    });
  }

  function onQuestionsRearrange({ sourceId, targetId }) {
    const newQuestionOrder = [...questionIds];
    const sourceIndex = newQuestionOrder.indexOf(sourceId);
    const targetIndex = newQuestionOrder.indexOf(targetId);
    newQuestionOrder.splice(sourceIndex, 1);
    newQuestionOrder.splice(targetIndex, 0, sourceId);
    setQuestionIds(newQuestionOrder);
  }

  function onSelectChoice({ questionId, choiceId }) {
    setQuestions({
      ...questions,
      [questionId]: {
        ...questions[questionId],
        errorMessage: '',
        choices: questions[questionId].choices.map(choice => ({
          ...choice,
          checked: choice.id === choiceId
        }))
      }
    });
  }

  function onChoicesRearrange({ questionIndex, choiceIds, choices }) {
    setQuestions({
      ...questions,
      [questionIds[questionIndex]]: {
        ...questions[questionIds[questionIndex]],
        choices: choiceIds.map(choiceId => choices[choiceId])
      }
    });
  }

  function onReset() {
    setQuestions(
      initialQuestions.length === 0
        ? newQuestion(0)
        : formatQuestions(initialQuestions)
    );
    setQuestionIds(
      initialQuestions.length > 0
        ? initialQuestions.map((question, index) => index)
        : [0]
    );
  }

  function handleSubmit() {
    let errorObj = {
      questionId: null,
      message: '',
      onEdit: true
    };
    const errorHash = {
      notDone: {
        message: 'Please click the "done" button below',
        onEdit: true
      },
      missingTitle: {
        message: 'Please enter title',
        onEdit: true
      },
      notEnoughChoices: {
        message: 'There must be at least 2 choices',
        onEdit: true
      },
      invalidChoice: {
        message: 'Please mark the correct choice',
        onEdit: false
      }
    };

    for (let i = 0; i < questionIds.length; i++) {
      if (!questions[i].deleted) {
        if (errorInQuestion(questions[i])) {
          errorObj = {
            questionId: i,
            message: errorHash[errorInQuestion(questions[i])].message,
            onEdit: errorHash[errorInQuestion(questions[i])].onEdit
          };
          break;
        }
      }
    }

    if (typeof errorObj.questionId === 'number') {
      setQuestions({
        ...questions,
        [errorObj.questionId]: {
          ...questions[errorObj.questionId],
          onEdit: errorObj.onEdit,
          errorMessage: errorObj.message
        }
      });
      setTimeout(
        () => QuestionsRef.current[errorObj.questionId].scrollIntoView(),
        0
      );
      return;
    }

    const finishedQuestions = questionIds
      .filter(questionId => !questions[questionId].deleted)
      .map(questionId => questions[questionId]);

    onSubmit(finishedQuestions);

    function errorInQuestion(question) {
      if (question.onEdit) return 'notDone';
      if (!question.title || stringIsEmpty(question.title)) {
        return 'missingTitle';
      }
      const validChoices = question.choices.filter(choice => !!choice.label);
      if (validChoices.length < 2) {
        return 'notEnoughChoices';
      }
      for (let i = 0; i < validChoices.length; i++) {
        if (validChoices[i].checked) {
          return false;
        }
      }
      return 'invalidChoice';
    }
  }

  function formatQuestions(questions) {
    let questionsObject = {};
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
      };
    });
    return questionsObject;
  }

  function newQuestion(questionId) {
    return {
      [questionId]: {
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
    };
  }
}
