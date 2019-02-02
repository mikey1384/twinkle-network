import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import Button from 'components/Button';
import { timeSince } from 'helpers/timeStampHelpers';
import { loadChat } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { initChat } from 'redux/actions/ChatActions';
import { profileThemes } from 'constants/defaultValues';
import RoundList from 'components/RoundList';
import Icon from 'components/Icon';

class ChatFeeds extends Component {
  static propTypes = {
    content: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    initChat: PropTypes.func.isRequired,
    profileTheme: PropTypes.string,
    reloadedBy: PropTypes.number,
    reloaderName: PropTypes.string,
    reloadTimeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userId: PropTypes.number,
    username: PropTypes.string
  };

  render() {
    const { content, profileTheme, style = {} } = this.props;
    const themeColor = profileTheme || 'logoBlue';
    return (
      <RoundList style={{ textAlign: 'center', marginTop: '0', ...style }}>
        <li
          style={{
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <p
            style={{
              fontWeight: 'bold',
              color: profileThemes[themeColor].color,
              fontSize: '2rem'
            }}
          >
            {content}
          </p>
          {this.renderDetails()}
          <Button success onClick={this.initChat}>
            <Icon icon="comments" />
            <span style={{ marginLeft: '1rem' }}>Join Conversation</span>
          </Button>
        </li>
      </RoundList>
    );
  }

  initChat = async() => {
    const { dispatch, initChat } = this.props;
    const data = await loadChat({ dispatch, channelId: 2 });
    initChat(data);
  };

  renderDetails = () => {
    const {
      userId,
      username,
      timeStamp,
      reloadedBy,
      reloaderName,
      reloadTimeStamp
    } = this.props;
    const posterString = (
      <>
        Started by <UsernameText user={{ id: userId, username }} />
        {timeStamp ? ` ${timeSince(timeStamp)}` : ''}
      </>
    );
    const reloaderString = (
      <div style={{ marginTop: '0.5rem' }}>
        Brought back by{' '}
        <UsernameText user={{ id: reloadedBy, username: reloaderName }} />
        {reloadTimeStamp ? ` ${timeSince(reloadTimeStamp)}` : ''}
      </div>
    );

    return (
      <div style={{ margin: '0.5rem 0 1.5rem 0' }}>
        <div>{userId ? posterString : 'Join the conversation!'}</div>
        {reloadedBy && reloaderString}
      </div>
    );
  };
}

export default connect(
  state => ({
    profileTheme: state.UserReducer.profileTheme
  }),
  dispatch => ({
    dispatch,
    initChat: data => dispatch(initChat(data))
  })
)(ChatFeeds);
