import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import Button from 'components/Button';
import Icon from 'components/Icon';
import DropdownList from 'components/DropdownList';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { setByUser } from 'helpers/requestHelpers';
import { connect } from 'react-redux';

class StarButton extends Component {
  static propTypes = {
    byUser: PropTypes.bool,
    contentId: PropTypes.number,
    direction: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isStarred: PropTypes.bool,
    onClick: PropTypes.func,
    onToggleByUser: PropTypes.func,
    onToggleStarred: PropTypes.func,
    style: PropTypes.object,
    uploader: PropTypes.object
  };

  state = {
    menuShown: false
  };

  render() {
    const {
      byUser,
      direction = 'left',
      isStarred,
      onClick = () => this.setState(state => ({ menuShown: !state.menuShown })),
      uploader,
      style
    } = this.props;
    const { menuShown } = this.state;
    return (
      <ErrorBoundary>
        <div style={style}>
          <Button
            {...(isStarred && byUser
              ? { gold: true }
              : byUser
              ? { warning: true }
              : { love: true })}
            filled={isStarred || byUser}
            onClick={onClick}
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
              <li onClick={this.onToggleStarred}>
                {isStarred ? 'De-star' : 'Star'} this video
              </li>
              <li onClick={this.onToggleByUser}>
                {byUser
                  ? `This video wasn't made by ${uploader.username}`
                  : `This video was made by ${uploader.username}`}
              </li>
            </DropdownList>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  handleClickOutside = event => {
    this.setState({ menuShown: false });
  };

  onToggleStarred = () => {
    const { onToggleStarred } = this.props;
    onToggleStarred();
    this.setState({ menuShown: false });
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
