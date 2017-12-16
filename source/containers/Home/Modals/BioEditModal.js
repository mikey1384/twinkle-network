import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import Button from 'components/Button'
import { Color } from 'constants/css'
import Input from 'components/Texts/Input'

const maxChar = 150
export default class BioEditModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    firstLine: PropTypes.string,
    secondLine: PropTypes.string,
    thirdLine: PropTypes.string
  }

  constructor(props) {
    super()
    this.state = {
      firstLine: props.firstLine || '',
      secondLine: props.secondLine || '',
      thirdLine: props.thirdLine || ''
    }
  }

  render() {
    const { onHide, onSubmit } = this.props
    const { firstLine, secondLine, thirdLine } = this.state
    return (
      <Modal show onHide={onHide} animation={false}>
        <Modal.Header closeButton>
          <h4>Edit Your Bio</h4>
        </Modal.Header>
        <Modal.Body>
          <form className="container-fluid">
            <fieldset className="form-group">
              <label>
                <strong>
                  Answer <b style={{ color: Color.blue }}>one or multiple</b>{' '}
                  questions below, or write anything you want about yourself
                </strong>
              </label>
              <div style={{ display: 'inline' }}>
                <Input
                  autoFocus
                  value={firstLine}
                  onChange={text => this.setState({ firstLine: text })}
                  className="form-control"
                  placeholder="Write something"
                  type="text"
                />
              </div>
              <small>
                {
                  "If you are a Twinkle student, which class are you in Twinkle? If you are a non-Twinkle student which english academy do you go to? (For example, LexKim) What's your teacher's name? If you are not a student, what is your occupation? If you don't want to answer these questions, feel free to introduce yourself anyway you want "
                }
              </small>
              <br />
              <b style={{ color: firstLine.length > maxChar && 'red' }}>{`(${
                firstLine.length
              }/${maxChar} characters)`}</b>
            </fieldset>
            <fieldset className="form-group">
              <label>
                <strong>
                  Answer <b style={{ color: Color.blue }}>one or multiple</b>{' '}
                  questions below, or write anything you want about yourself
                </strong>
              </label>
              <div style={{ display: 'inline' }}>
                <Input
                  value={secondLine}
                  onChange={text => this.setState({ secondLine: text })}
                  className="form-control"
                  placeholder="Write something"
                  type="text"
                />
              </div>
              <small>
                {
                  "What is your favorite activity? What do you love doing? If you like books, what are some of your favorite books? If you like video games, what's your favorite video game title? What do you normally do when you play with your friends? Or, feel free to write anything you want (ideally about something you love doing)"
                }
              </small>
              <br />
              <b style={{ color: secondLine.length > maxChar && 'red' }}>{`(${
                secondLine.length
              }/${maxChar} characters)`}</b>
            </fieldset>
            <fieldset className="form-group">
              <label>
                <strong>
                  Answer <b style={{ color: Color.blue }}>one or multiple</b>{' '}
                  questions below, or write anything you want about yourself
                </strong>
              </label>
              <div style={{ display: 'inline' }}>
                <Input
                  value={thirdLine}
                  onChange={text => this.setState({ thirdLine: text })}
                  className="form-control"
                  placeholder="Write something"
                  type="text"
                />
              </div>
              <small>
                {
                  "Which school do you go to? (Example: Daechi elementary school) What grade are you in? If you've finished school, which was the last school you've attended? What is your favorite school subject? Or, write anything you wish to tell your friends about yourself"
                }
              </small>
              <br />
              <b style={{ color: thirdLine.length > maxChar && 'red' }}>{`(${
                thirdLine.length
              }/${maxChar} characters)`}</b>
            </fieldset>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-default" onClick={onHide}>
            Cancel
          </Button>
          <Button
            className="btn btn-primary"
            onClick={() => onSubmit({ firstLine, secondLine, thirdLine })}
            type="submit"
            disabled={
              firstLine.length > maxChar ||
              secondLine.length > maxChar ||
              thirdLine.length > maxChar
            }
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
