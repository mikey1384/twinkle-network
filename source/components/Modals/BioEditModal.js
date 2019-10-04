import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { Color } from 'constants/css';
import Input from 'components/Texts/Input';
import { css } from 'emotion';
import { addEmoji, finalizeEmoji } from 'helpers/stringHelpers';

const MAX_CHAR = 150;

BioEditModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  firstLine: PropTypes.string,
  secondLine: PropTypes.string,
  thirdLine: PropTypes.string
};

export default function BioEditModal({ onHide, onSubmit, ...props }) {
  const [firstLine, setFirstLine] = useState(props.firstLine || '');
  const [secondLine, setSecondLine] = useState(props.secondLine || '');
  const [thirdLine, setThirdLine] = useState(props.thirdLine || '');

  return (
    <Modal
      onHide={onHide}
      className={css`
        b {
          color: ${Color.green()};
        }
        p {
          color: ${Color.darkerGray()};
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        small {
          font-size: 1.3rem;
          color: ${Color.lightGray()};
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
            onChange={text => setFirstLine(addEmoji(text))}
            placeholder="Write something"
          />
          <small
            style={{ color: firstLine.length > MAX_CHAR && 'red' }}
          >{`(${firstLine.length}/${MAX_CHAR} characters)`}</small>
          <p>
            {
              "If you are a Twinkle student, which class are you in Twinkle? If you are a non-Twinkle student, which english academy do you go to? What's your teacher's name? If you are not a student, what is your occupation? If you don't want to answer these questions, feel free to introduce yourself anyway you want "
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
            onChange={text => setSecondLine(addEmoji(text))}
            placeholder="Write something"
          />
          <small
            style={{ color: secondLine.length > MAX_CHAR && 'red' }}
          >{`(${secondLine.length}/${MAX_CHAR} characters)`}</small>
          <p>
            {`What do you love doing? What do you normally do when you play with your friends? What would you do all day if your parents allowed you to do anything you want? Don't like these questions? Then feel free to write anything you want (ideally about your favorite activity)`}
          </p>
        </div>
        <div>
          <label>
            <strong>
              Answer <b style={{ color: Color.green() }}>one or multiple</b>{' '}
              questions below, or write anything you want about yourself
            </strong>
          </label>
          <Input
            value={thirdLine}
            onChange={text => setThirdLine(addEmoji(text))}
            placeholder="Write something"
          />
          <small
            style={{ color: thirdLine.length > MAX_CHAR && 'red' }}
          >{`(${thirdLine.length}/${MAX_CHAR} characters)`}</small>
          <p>
            {
              "Which school do you go to? (Example: Daechi elementary school) What grade are you in? If you've finished school, which was the last school you've attended? What is your favorite school subject? Or, write anything you wish"
            }
          </p>
        </div>
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={() =>
            onSubmit({
              firstLine: finalizeEmoji(firstLine),
              secondLine: finalizeEmoji(secondLine),
              thirdLine: finalizeEmoji(thirdLine)
            })
          }
          type="submit"
          disabled={
            firstLine.length > MAX_CHAR ||
            secondLine.length > MAX_CHAR ||
            thirdLine.length > MAX_CHAR
          }
        >
          Submit
        </Button>
      </footer>
    </Modal>
  );
}
