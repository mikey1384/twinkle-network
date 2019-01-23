import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { connect } from 'react-redux';
import { setDifficulty } from 'helpers/requestHelpers';

class DifficultyModal extends Component {
  static propTypes = {
    contentId: PropTypes.number.isRequired,
    difficulty: PropTypes.number,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
  };

  constructor({ difficulty = 0 }) {
    super();
    this.state = {
      difficulty
    };
  }

  render() {
    const { onHide } = this.props;
    const { difficulty } = this.state;
    return (
      <Modal onHide={onHide}>
        <header>
          Set Reward Level (consider both difficulty and importance)
        </header>
        <main style={{ fontSize: '3rem', paddingTop: 0 }}>
          <div style={{ marginTop: '5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex' }}>
              <Icon
                key={0}
                icon={difficulty > 0 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ difficulty: 1 })}
              />
              <Icon
                key={1}
                icon={difficulty > 1 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ difficulty: 2 })}
              />
              <Icon
                key={2}
                icon={difficulty > 2 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ difficulty: 3 })}
              />
              <Icon
                key={3}
                icon={difficulty > 3 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ difficulty: 4 })}
              />
              <Icon
                key={4}
                icon={difficulty > 4 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ difficulty: 5 })}
              />
            </div>
            <a
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                userSelect: 'none'
              }}
              onClick={() => this.setState({ difficulty: 0 })}
            >
              Clear
            </a>
          </div>
        </main>
        <footer>
          <Button
            transparent
            style={{ marginRight: '0.7rem' }}
            onClick={onHide}
          >
            Cancel
          </Button>
          <Button primary onClick={this.onSubmit}>
            Set
          </Button>
        </footer>
      </Modal>
    );
  }

  onSubmit = async() => {
    const { dispatch, contentId, onSubmit, type } = this.props;
    const { difficulty } = this.state;
    await setDifficulty({ contentId, type, difficulty, dispatch });
    onSubmit({ contentId, difficulty, type });
  };
}

export default connect(
  null,
  dispatch => ({
    dispatch
  })
)(DifficultyModal);
