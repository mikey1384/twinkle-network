import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import InfoEditForm from './InfoEditForm';
import { connect } from 'react-redux';
import { Color } from 'constants/css';
import { trimUrl } from 'helpers/stringHelpers';
import { uploadProfileInfo } from 'helpers/requestHelpers';
import { timeSince } from 'helpers/timeStampHelpers';
import { setProfileInfo } from 'redux/actions/UserActions';

class BasicInfos extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    email: PropTypes.string,
    joinDate: PropTypes.string,
    lastActive: PropTypes.string,
    myId: PropTypes.number,
    selectedTheme: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    website: PropTypes.string,
    youtubeName: PropTypes.string,
    youtubeUrl: PropTypes.string,
    setProfileInfo: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  state = {
    onEdit: false
  };

  render() {
    const {
      className,
      email,
      joinDate,
      lastActive,
      myId,
      selectedTheme,
      userId,
      username,
      website,
      youtubeName,
      youtubeUrl,
      style
    } = this.props;
    const { onEdit } = this.state;
    return (
      <div className={className} style={style}>
        <div
          style={{
            color: Color[selectedTheme](),
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}
        >
          About {username}
        </div>
        {onEdit && (
          <InfoEditForm
            email={email}
            youtubeUrl={youtubeUrl}
            youtubeName={youtubeName}
            website={website}
            onCancel={() => this.setState({ onEdit: false })}
            onSubmit={this.onEditedInfoSubmit}
          />
        )}
        {!onEdit &&
          (email || youtubeUrl) && (
            <div style={{ textAlign: 'center' }}>
              {email && (
                <div>
                  <span>Email: </span>
                  <a
                    href={`mailto:${email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {email}
                  </a>
                </div>
              )}
              {youtubeUrl && (
                <div>
                  <span>YouTube: </span>
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {youtubeName || trimUrl(youtubeUrl)}
                  </a>
                </div>
              )}
              {website && (
                <div>
                  <span>Website: </span>
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {trimUrl(website)}
                  </a>
                </div>
              )}
            </div>
          )}
        {!onEdit &&
          myId === userId &&
          (!email || !youtubeUrl || !website) && (
            <div
              style={{
                textAlign: 'center',
                marginTop: email || youtubeUrl ? '1rem' : 0
              }}
            >
              {this.renderEditMessage({ email, youtubeUrl, website })}
            </div>
          )}
        {myId === userId ? (
          !onEdit ? (
            <Button
              style={{
                marginTop: !email || !youtubeUrl || !website ? 0 : '1rem'
              }}
              transparent
              onClick={() => this.setState({ onEdit: true })}
            >
              <Icon icon="pencil-alt" />
              <span style={{ marginLeft: '0.7rem' }}>Edit</span>
            </Button>
          ) : null
        ) : (
          <div
            style={{
              marginTop: email || youtubeUrl ? '2rem' : 0,
              textAlign: 'center'
            }}
          >
            <div>Became a member {timeSince(joinDate)}</div>
            <div>Was last active {timeSince(lastActive)}</div>
          </div>
        )}
      </div>
    );
  }

  onEditedInfoSubmit = async({ email, website, youtubeName, youtubeUrl }) => {
    const { dispatch, setProfileInfo } = this.props;
    const data = await uploadProfileInfo({
      dispatch,
      email,
      website,
      youtubeName,
      youtubeUrl
    });
    setProfileInfo(data);
    this.setState({ onEdit: false });
  };

  renderEditMessage = ({ email, youtubeUrl, website }) => {
    const unfilledItems = [
      { label: 'email', value: email },
      { label: 'YouTube', value: youtubeUrl },
      { label: 'website', value: website }
    ].filter(item => !item.value);
    const emptyItemsArray = unfilledItems.map(item => item.label);
    const emptyItemsString =
      emptyItemsArray.length === 3
        ? `${emptyItemsArray[0]}, ${emptyItemsArray[1]}, and ${
            emptyItemsArray[2]
          }`
        : emptyItemsArray.join(' and ');
    return `Add your ${emptyItemsString} address${
      emptyItemsArray.length > 1 ? 'es' : ''
    } by tapping the "Edit" button below`;
  };
}

export default connect(
  null,
  dispatch => ({
    dispatch,
    setProfileInfo: data => dispatch(setProfileInfo(data))
  })
)(BasicInfos);
