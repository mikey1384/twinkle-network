import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {uploadQuestion} from 'redux/actions/FeedActions'
import Input from 'components/Texts/Input'
import {stringIsEmpty, turnStringIntoQuestion} from 'helpers/stringHelpers'
import {Color} from 'constants/css'

class QuestionInput extends Component {
  static propTypes = {
    uploadQuestion: PropTypes.func.isRequired
  }

  constructor() {
    super()
    this.state = {
      question: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {question} = this.state
    return (
      <div className="panel panel-default"
        style={{
          borderTop: '1px solid rgb(231, 231, 231)'
        }}
      >
        <div className="panel-body">
          <fieldset className="form-group">
            <form
              className="container-fluid"
              onSubmit={this.onSubmit}
            >
              <p style={{fontSize: '1.2em'}}>
                <b>Ask <span style={{color: Color.green}}>questions</span> to friends and teachers in Twinkle</b>
              </p>
              <Input
                className="form-control"
                placeholder="Ask a question (and feel free to answer your own questions)"
                value={question}
                onChange={text => this.setState({question: text})}
                style={{marginBottom: '0.3em'}}
              />
              <small style={{color: question.length > 100 ? 'red' : null}}>{question.length}/100 Characters
                {question.length <= 100 && <span> (Press <b>Enter</b> to submit)</span>}
              </small>
            </form>
          </fieldset>
        </div>
      </div>
    )
  }

  async onSubmit(event) {
    const {uploadQuestion} = this.props
    const {question} = this.state
    event.preventDefault()
    if (stringIsEmpty(question) || question.length > 100) return
    let questionString = turnStringIntoQuestion(question)
    await uploadQuestion(questionString)
    this.setState({question: ''})
  }
}

export default connect(
  null,
  {uploadQuestion}
)(QuestionInput)
