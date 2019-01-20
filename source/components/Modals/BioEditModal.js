import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { Color } from 'constants/css';
import Input from 'components/Texts/Input';
import { css } from 'emotion';

const maxChar = 150;
export default class BioEditModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    firstLine: PropTypes.string,
    secondLine: PropTypes.string,
    thirdLine: PropTypes.string
  };

  constructor(props) {
    super();
    this.state = {
      firstLine: props.firstLine || '',
      secondLine: props.secondLine || '',
      thirdLine: props.thirdLine || ''
    };
  }

  render() {
    const { onHide, onSubmit } = this.props;
    const { firstLine, secondLine, thirdLine } = this.state;
    return (
      <Modal
        onHide={onHide}
        className={css`
          b {
            color: ${Color.green()};
          }
          p {
            color: ${Color.darkGray()};
            margin-top: 1rem;
            margin-bottom: 1rem;
          }
          small {
            font-size: 1.3rem;
            color: ${Color.buttonGray()};
          }
        `}
      >
        <header>Edit Your Bio</header>
        <main style={{ width: '100%', justifyContent: 'flex-start' }}>
          <div>
            <label>
              <strong>
                Answer <b>one or multiple</b> questions below, or write anything
                you want about yourself
              </strong>
            </label>
            <Input
              autoFocus
              value={firstLine}
              onChange={text => this.setState({ firstLine: text })}
              placeholder="Write something"
              type="text"
            />
            <small style={{ color: firstLine.length > maxChar && 'red' }}>{`(${
              firstLine.length
            }/${maxChar} characters)`}</small>
            <p>
              {
                "If you are a Twinkle student, which class are you in Twinkle? If you are a non-Twinkle student which english academy do you go to? What's your teacher's name? If you are not a student, what is your occupation? If you don't want to answer these questions, feel free to introduce yourself anyway you want "
              }
            </p>
          </div>
          <div>
            <label>
              <strong>
                Answer <b>one or multiple</b> questions below, or write anything
                you want about yourself
              </strong>
            </label>
            <Input
              value={secondLine}
              onChange={text => this.setState({ secondLine: text })}
              placeholder="Write something"
              type="text"
            />
            <small style={{ color: secondLine.length > maxChar && 'red' }}>{`(${
              secondLine.length
            }/${maxChar} characters)`}</small>
            <p>
              {
                'What is your favorite activity? What do you love doing? If you like books, what are some of your favorite books? If you like video games, what are your favorite video game titles? What do you normally do when you play with your friends? If you find none of these questions interesting, feel free to write anything you want (ideally about something you love doing)'
              }
            </p>
          </div>
          <div>
            <label>
              <strong>
                Answer <b style={{ color: Color.blue }}>one or multiple</b>{' '}
                questions below, or write anything you want about yourself
              </strong>
            </label>
            <Input
              value={thirdLine}
              onChange={text => this.setState({ thirdLine: text })}
              className="form-control"
              placeholder="Write something"
              type="text"
            />
            <small style={{ color: thirdLine.length > maxChar && 'red' }}>{`(${
              thirdLine.length
            }/${maxChar} characters)`}</small>
            <p>
              {
                "Which school do you go to? (Example: Daechi elementary school) What grade are you in? If you've finished school, which was the last school you've attended? What is your favorite school subject? Or, write anything you wish to tell your friends about yourself"
              }
            </p>
          </div>
        </main>
        <footer>
          <Button
            transparent
            onClick={onHide}
            style={{ marginRight: '0.7rem' }}
          >
            Cancel
          </Button>
          <Button
            primary
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
        </footer>
      </Modal>
    );
  }
}
