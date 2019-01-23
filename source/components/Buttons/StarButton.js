import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import Button from 'components/Button';
import Icon from 'components/Icon';
import DropdownList from 'components/DropdownList';
import DifficultyModal from 'components/Modals/DifficultyModal';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { setByUser } from 'helpers/requestHelpers';
import { connect } from 'react-redux';

class StarButton extends Component {
  static propTypes = {
    byUser: PropTypes.bool,
    contentId: PropTypes.number,
    difficulty: PropTypes.number,
    direction: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    onSetDifficulty: PropTypes.func,
    onToggleByUser: PropTypes.func,
    style: PropTypes.object,
    type: PropTypes.string.isRequired,
    uploader: PropTypes.object
  };

  state = {
    difficultyModalShown: false,
    menuShown: false
  };

  render() {
    const {
      byUser,
      contentId,
      difficulty,
      direction = 'left',
      onSetDifficulty,
      uploader,
      style,
      type
    } = this.props;
    const { difficultyModalShown, menuShown } = this.state;
    return (
      <ErrorBoundary>
        <div style={style}>
          <Button
            {...(!!difficulty && byUser
              ? { gold: true }
              : byUser
              ? { warning: true }
              : { love: true })}
            filled={!!difficulty || byUser}
            onClick={this.onClick}
          >
            <Icon icon="star" />
          </Button>
          {menuShown && (
            <DropdownList
              direction={direction}
              style={{
                position: 'absolute',
                right: 0,
                width: '25rem'
              }}
            >
              <li onClick={this.onSetDifficultyClick}>Set Reward Level</li>
              <li onClick={this.onToggleByUser}>
                {byUser
                  ? `This video wasn't made by ${uploader.username}`
                  : `This video was made by ${uploader.username}`}
              </li>
            </DropdownList>
          )}
        </div>
        {difficultyModalShown && (
          <DifficultyModal
            type={type}
            contentId={contentId}
            difficulty={difficulty}
            onSubmit={data => {
              onSetDifficulty(data);
              this.setState({ difficultyModalShown: false });
            }}
            onHide={() => this.setState({ difficultyModalShown: false })}
          />
        )}
      </ErrorBoundary>
    );
  }

  handleClickOutside = event => {
    this.setState({ menuShown: false });
  };

  onClick = () => {
    const { type } = this.props;
    if (type === 'video') {
      return this.setState(state => ({ menuShown: !state.menuShown }));
    }
    return this.setState({ difficultyModalShown: true });
  };

  onSetDifficultyClick = () => {
    this.setState({ difficultyModalShown: true, menuShown: false });
  };

  onToggleByUser = async() => {
    const { contentId, dispatch, onToggleByUser } = this.props;
    const byUser = await setByUser({ contentId, dispatch });
    onToggleByUser(byUser);
    this.setState({ menuShown: false });
  };
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(onClickOutside(StarButton));
