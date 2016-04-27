import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'react-bootstrap';
import CheckListGroup from 'components/CheckListGroup';
import ButtonGroup from 'components/ButtonGroup';

export default class QuestionsBuilder extends Component {
  state = {
    questions: ["Question Title"],
    interfaceMarginTop: 0
  }
  render() {
    const listItems = [
      {
        label: "Choice A",
        checked: false
      },
      {
        label: "Choice B",
        checked: false
      },
      {
        label: "Choice C",
        checked: false
      },
      {
        label: "Choice D",
        checked: false
      },
      {
        label: "Choice E",
        checked: false
      }
    ]

    const topButtons = [
      {
        label: "+ Add",
        onClick: () => {
          const questions = this.state.questions;
          const newQuestions = questions.concat(["Added Question"]);
          this.setState({questions: newQuestions})
        },
        buttonClass: "btn-primary"
      },
      {
        label: "Reorder",
        onClick: () => console.log("pressed"),
        buttonClass: "btn-info"
      },
      {
        label: "Reset",
        onClick: () => console.log("pressed"),
        buttonClass: "btn-warning"
      }
    ]
    return (
      <Modal
        {...this.props}
        animation={false}
        backdrop="static"
        dialogClassName="modal-extra-lg"
        onScroll={this.handleScroll.bind(this)}
      >
        <Modal.Header closeButton>
          <h2 className="text-center">{this.props.title}</h2>
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
              {
                this.state.questions.map((question, index) => {
                  const style = index !== 0 ? {paddingTop: '1em'} : null
                  return (
                    <div
                      key={index}
                      style={style}
                    >
                      <h4>{question}</h4>
                      <CheckListGroup
                        inputType="radio"
                        listItems={listItems}
                        onSelect={this.onSelectChoice.bind(this)}
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
                  src={`https://www.youtube.com/embed/${this.props.videocode}`}>
                </iframe>
              </div>
              <div
                className="text-center"
                style={{marginTop: '1em'}}
              >
                <ButtonGroup
                  buttons={topButtons}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  handleScroll(event) {
    const scrollTop = event.target.scrollTop;
    this.setState({interfaceMarginTop: scrollTop})
  }

  onSelectChoice() {
    console.log("selected")
  }
}
