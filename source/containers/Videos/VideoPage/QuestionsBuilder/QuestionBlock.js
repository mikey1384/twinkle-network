import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ChoiceListItem from './ChoiceListItem'
import EditChoiceListItem from './EditChoiceListItem'
import Textarea from 'components/Texts/Textarea'
import Button from 'components/Button'
import { cleanString } from 'helpers/stringHelpers'
import { borderRadius, innerBorderRadius, Color } from 'constants/css'
import Banner from 'components/Banner'
import { css } from 'emotion'

export default class QuestionBlock extends Component {
  static propTypes = {
    choices: PropTypes.array.isRequired,
    deleted: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    id: PropTypes.number.isRequired,
    innerRef: PropTypes.func.isRequired,
    onEdit: PropTypes.bool.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onEditStart: PropTypes.func.isRequired,
    onRearrange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onSelectChoice: PropTypes.func.isRequired,
    hideErrorMsg: PropTypes.func.isRequired,
    onUndoRemove: PropTypes.func.isRequired,
    questionIndex: PropTypes.number.isRequired,
    title: PropTypes.string
  }

  state = {
    editedQuestionTitle: '',
    choices: {},
    choiceIds: []
  }

  componentWillMount() {
    const { title, choices } = this.props
    this.setState({
      editedQuestionTitle: title,
      choices: choices.reduce((result, choice) => {
        return { ...result, [choice.id]: choice }
      }, {}),
      choiceIds: choices.map(choice => choice.id)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.choices !== this.props.choices) {
      this.setState({
        choices: this.props.choices.reduce((result, choice) => {
          return { ...result, [choice.id]: choice }
        }, {}),
        choiceIds: this.props.choices.map(choice => choice.id)
      })
    }
  }

  render() {
    const { choices, choiceIds, editedQuestionTitle } = this.state
    const {
      errorMessage,
      id,
      innerRef,
      onSelectChoice,
      questionIndex,
      onRearrange,
      onEdit,
      deleted,
      title,
      hideErrorMsg
    } = this.props
    const choicePlaceHolder = [
      'Choice A',
      'Choice B',
      'Choice C (Optional)',
      'Choice D (Optional)',
      'Choice E (Optional)'
    ]
    return (
      <div
        className={css`
          margin-top: ${questionIndex === 0 ? 0 : '2rem'};
        `}
      >
        <Banner
          danger
          innerRef={innerRef}
          style={{
            width: '100%',
            display: errorMessage ? 'block' : 'none',
            marginBottom: '1rem'
          }}
        >
          {errorMessage}
        </Banner>
        <div className={this.Styles.content}>
          <div
            style={{ width: onEdit ? '100%' : 'auto', position: 'relative' }}
          >
            {!onEdit ? (
              <h2
                style={{
                  opacity: deleted && '0.2',
                  color: !title && '#999'
                }}
              >
                {title || 'Question Title'}
              </h2>
            ) : (
              <Textarea
                autoFocus
                type="text"
                placeholder="Enter Question..."
                value={cleanString(editedQuestionTitle)}
                onChange={event => {
                  hideErrorMsg(id)
                  this.setState({ editedQuestionTitle: event.target.value })
                }}
              />
            )}
          </div>
          <div>
            {!onEdit &&
              !deleted && (
                <Button love filled onClick={() => this.props.onRemove(id)}>
                  Remove
                </Button>
              )}
            {deleted && (
              <Button snow onClick={() => this.props.onUndoRemove(id)}>
                Undo
              </Button>
            )}
          </div>
        </div>
        <div
          className={this.Styles.choiceList}
          style={{ opacity: deleted && '0.2' }}
        >
          {choiceIds.map((choiceId, index) => {
            return onEdit ? (
              <EditChoiceListItem
                key={choiceId}
                checked={choices[choiceId].checked}
                choiceId={choiceId}
                onEdit={this.onEditChoice}
                onSelect={() => this.onSelectChoice(choiceId)}
                placeholder={choicePlaceHolder[index]}
                text={choices[choiceId].label}
              />
            ) : (
              <ChoiceListItem
                key={choiceId}
                id={choiceId}
                deleted={deleted}
                questionIndex={questionIndex}
                onDrop={() =>
                  onRearrange({ questionIndex, choiceIds, choices })
                }
                onMove={this.onMove}
                checked={choices[choiceId].checked}
                onSelect={() => onSelectChoice({ questionId: id, choiceId })}
                label={choices[choiceId].label}
                placeholder={choicePlaceHolder[index]}
                checkDisabled={deleted}
              />
            )
          })}
        </div>
        <div
          className={css`
            display: flex;
            justify-content: center;
            margin-top: 1rem;
          `}
        >
          {!onEdit ? (
            <Button
              transparent
              onClick={() => this.props.onEditStart(id)}
              style={{ opacity: deleted && '0.2', fontSize: '2rem' }}
              disabled={deleted && true}
            >
              <span className="glyphicon glyphicon-pencil" />&nbsp;&nbsp;Edit
              Questions
            </Button>
          ) : (
            <div>
              <Button
                transparent
                onClick={() => this.onEditCancel(id)}
              >
                Cancel
              </Button>
              <Button
                primary
                style={{ marginLeft: '1rem' }}
                onClick={this.onEditDone}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  onEditChoice = ({ choiceId, text }) => {
    const { id, hideErrorMsg } = this.props
    hideErrorMsg(id)
    this.setState(state => ({
      choices: {
        ...state.choices,
        [choiceId]: {
          ...state.choices[choiceId],
          label: text
        }
      }
    }))
  }

  onEditCancel = questionIndex => {
    const { id, hideErrorMsg } = this.props
    hideErrorMsg(id)
    this.setState({
      editedChoiceTitles: this.props.choices.map(choice => choice.label),
      editedQuestionTitle: this.props.title
    })
    this.props.onEditCancel(questionIndex)
  }

  onEditDone = () => {
    const { id, hideErrorMsg, onEditDone } = this.props
    const { choices, choiceIds, editedQuestionTitle } = this.state
    hideErrorMsg(id)
    onEditDone({ id, choices, choiceIds, editedQuestionTitle })
  }

  onSelectChoice = choiceId => {
    const { id, hideErrorMsg } = this.props
    hideErrorMsg(id)
    this.setState(state => ({
      choices: this.props.choices.reduce((result, choice) => {
        return {
          ...result,
          [choice.id]: {
            ...state.choices[choice.id],
            checked: choice.id === choiceId
          }
        }
      }, {})
    }))
  }

  onMove = ({ sourceId, targetId }) => {
    const newIndices = [...this.state.choiceIds]
    const sourceIndex = newIndices.indexOf(sourceId)
    const targetIndex = newIndices.indexOf(targetId)
    newIndices.splice(sourceIndex, 1)
    newIndices.splice(targetIndex, 0, sourceId)
    this.setState({ choiceIds: newIndices })
  }

  determineLabel = (choices, index) => {
    let label = ''
    for (let i = 0; i < choices.length; i++) {
      if (choices[i].id === index) {
        label = choices[i].label
      }
    }
    return label
  }

  Styles = {
    content: css`
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    `,
    choiceList: css`
      display: flex;
      flex-direction: column;
      width: 100%;
      > nav {
        display: flex;
        width: 100%;
        border: 1px solid ${Color.borderGray()};
        margin-bottom: -1px;
        > main {
          position: relative;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          width: CALC(100% - 4.3rem);
          > section {
            padding: 0.5rem;
            width: 100%;
            line-height: 1.5;
            display: flex;
          }
        }
        > aside {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4.5rem;
          background: ${Color.inputBorderGray()};
        }
        &:first-child {
          border-top-left-radius: ${borderRadius};
          border-top-right-radius: ${borderRadius};
          > aside {
            border-top-right-radius: ${innerBorderRadius};
          }
        }
        &:last-child {
          border-bottom-left-radius: ${borderRadius};
          border-bottom-right-radius: ${borderRadius};
          > aside {
            border-bottom-right-radius: ${innerBorderRadius};
          }
        }
      }
    `
  }
}

