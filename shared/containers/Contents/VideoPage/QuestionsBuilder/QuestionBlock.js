import React, { Component } from 'react';
import ChoiceListItem from './ChoiceListItem';
import EditChoiceListItem from './EditChoiceListItem';
import Textarea from 'react-textarea-autosize';
import { processedString } from 'helpers/StringHelper';

export default class QuestionBlock extends Component {
  state = {
    editedChoiceTitles: this.props.choices.map(choice => {
      return choice.label
    }),
    editedQuestionTitle: this.props.title,
    choiceIndices: this.props.choices.map(choice => {
      return choice.id
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.choices !== nextProps.choices) {
      this.setState({
        choiceIndices: nextProps.choices.map(choice => {
          return choice.id
        }),
        editedChoiceTitles: nextProps.choices.map(choice => {
          return choice.label
        })
      })
    }
  }

  render() {
    const { editedChoiceTitles, editedQuestionTitle, choiceIndices } = this.state;
    const { inputType, onSelectChoice, questionIndex, onEdit, deleted, title, choices } = this.props;
    const choicePlaceHolder = [
      "Choice A",
      "Choice B",
      "Choice C (Optional)",
      "Choice D (Optional)",
      "Choice E (Optional)"
    ]
    return (
      <div>
        <div className="clearfix">
          { !onEdit ?
            <h4
              className="pull-left col-sm-10"
              style={{
                opacity: deleted && '0.2',
                paddingLeft: '0px',
                color: !title && '#999'
              }}
            >
              <span dangerouslySetInnerHTML={{__html: title || "Question Title"}} />
            </h4> :
            <form
              onSubmit={ event => event.preventDefault() }
              style={{
                marginBottom: '1em'
              }}
            >
              <Textarea
                ref="editTitleInput"
                type="text"
                className="form-control"
                placeholder="Enter Title..."
                value={editedQuestionTitle}
                onChange={event => this.setState({editedQuestionTitle: event.target.value})}
              >
              </Textarea>
            </form>
          }
          { !onEdit && !deleted &&
            <button
              className="col-sm-2 btn btn-danger btn-sm"
              onClick={ () => this.props.onRemove(questionIndex) }
            >Remove</button>
          }
          { deleted &&
            <button
              className="col-sm-2 btn btn-default btn-sm"
              onClick={ () => this.props.onUndoRemove(questionIndex) }
            >Undo</button>
          }
        </div>
        <div
          className="list-group"
          style={{opacity: deleted && '0.2'}}
          {...this.props}
        >
          {
            choiceIndices.map((choiceIndex, index) => {
              return !onEdit ? <ChoiceListItem
                  key={index}
                  placeholder={choicePlaceHolder[index]}
                  questionIndex={questionIndex}
                  id={choiceIndex}
                  onSelect={() => onSelectChoice(questionIndex, index)}
                  label={determineLabel(choices, choiceIndex)}
                  inputType={inputType}
                  checked={determineChecked(choices, choiceIndex)}
                  onMove={this.onMove.bind(this)}
                  onDrop={this.onDrop.bind(this)}
                  checkDisabled={deleted}
                /> :
                <EditChoiceListItem
                  key={index}
                  placeholder={choicePlaceHolder[index]}
                  onSelect={() => onSelectChoice(questionIndex, index)}
                  checked={determineChecked(choices, choiceIndex)}
                  index={index}
                  text={editedChoiceTitles[index]}
                  onEdit={this.onEditChoice.bind(this)}
                />
            })
          }
        </div>
        <div
          className="text-center"
        >
          { !onEdit ?
            <button
              className="btn btn-info"
              onClick={() => this.props.onEditStart(questionIndex)}
              style={{opacity: deleted && '0.2'}}
              disabled={deleted && true}
            >Edit</button> :
            <div>
              <button
                className="btn btn-default"
                onClick={() => this.onEditCancel(questionIndex)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{marginLeft: '0.5em'}}
                onClick={() => this.onEditDone(questionIndex)}
              >
                Done
              </button>
            </div>
          }
        </div>
      </div>
    )
  }

  onEditChoice(index, value) {
    const newTitles = this.state.editedChoiceTitles;
    newTitles[index] = value;
    this.setState({
      editedChoiceTitles: newTitles
    })
  }

  onEditCancel(questionIndex) {
    this.setState({
      editedChoiceTitles: this.props.choices.map(choice => {
        return choice.label
      }),
      editedQuestionTitle: this.props.title
    })
    this.props.onEditCancel(questionIndex)
  }

  onEditDone(questionIndex) {
    this.props.onEditDone({
      questionIndex,
      newChoicesArray: this.props.choices.map((choice, index) => {
        choice.label = processedString(this.state.editedChoiceTitles[index]);
        return choice;
      }),
      newTitle: processedString(this.state.editedQuestionTitle)
    });
  }

  onMove({sourceId, targetId}) {
    const newIndices = this.state.choiceIndices;
    const sourceIndex = newIndices.indexOf(sourceId);
    const targetIndex = newIndices.indexOf(targetId);
    newIndices.splice(sourceIndex, 1);
    newIndices.splice(targetIndex, 0, sourceId);
    this.setState({choiceIndices: newIndices})
  }

  onDrop() {
    const { questionIndex } = this.props;
    const { choiceIndices } = this.state;
    this.props.onRearrange({questionIndex, choiceIndices});
  }
}

function determineLabel (choices, index) {
  let label = '';
  for (let i = 0; i < choices.length; i++) {
    if (choices[i].id === index) {
      label = choices[i].label;
    }
  }
  return label;
}

function determineChecked (choices, index) {
  let checked;
  for (let i = 0; i < choices.length; i++) {
    if (choices[i].id === index) {
      checked = choices[i].checked;
    }
  }
  return checked;
}
