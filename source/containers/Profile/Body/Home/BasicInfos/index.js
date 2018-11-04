import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import InfoEditForm from './InfoEditForm';
import { connect } from 'react-redux';
import { Color } from 'constants/css';
import { trimUrl } from 'helpers/stringHelpers';
import {
  uploadProfileInfo,
  sendVerificationEmail
} from 'helpers/requestHelpers';
import { timeSince } from 'helpers/timeStampHelpers';
import { setProfileInfo } from 'redux/actions/UserActions';

class BasicInfos extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    email: PropTypes.string,
    emailVerified: PropTypes.bool,
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

  mounted = false;

  state = {
    emailCheckHighlighted: false,
    onEdit: false,
    verificationEmailSent: false
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      className,
      email,
      emailVerified,
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
    const { emailCheckHighlighted, onEdit, verificationEmailSent } = this.state;
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
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        lineHeight:
                          myId === userId && !emailVerified
                            ? '0.5rem'
                            : undefined
                      }}
                    >
                      <span>Email: </span>
                      <a
                        href={`mailto:${email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {email}
                      </a>
                    </div>
                    <Icon
                      onMouseEnter={() =>
                        this.setState({
                          emailCheckHighlighted:
                            !verificationEmailSent && myId === userId
                        })
                      }
                      onMouseLeave={() =>
                        this.setState({ emailCheckHighlighted: false })
                      }
                      style={{
                        cursor:
                          verificationEmailSent ||
                          myId !== userId ||
                          emailVerified
                            ? 'default'
                            : 'pointer',
                        marginLeft: '1rem',
                        color:
                          emailVerified || emailCheckHighlighted
                            ? Color[selectedTheme]()
                            : Color.lightGray()
                      }}
                      icon="check-circle"
                      onClick={
                        myId !== userId || emailVerified
                          ? () => {}
                          : this.onVerifyEmail
                      }
                    />
                  </div>
                  {myId === userId &&
                    !emailVerified && (
                      <div>
                        <a
                          onMouseEnter={() =>
                            this.setState({
                              emailCheckHighlighted: !verificationEmailSent
                            })
                          }
                          onMouseLeave={() =>
                            this.setState({ emailCheckHighlighted: false })
                          }
                          style={{
                            textDecoration: emailCheckHighlighted
                              ? 'underline'
                              : undefined,
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            color: Color[selectedTheme]()
                          }}
                          onClick={
                            verificationEmailSent
                              ? this.goToEmail
                              : this.onVerifyEmail
                          }
                        >
                          {verificationEmailSent
                            ? 'Email has been sent. Click here to check your inbox'
                            : 'Please verify your email'}
                        </a>
                      </div>
                    )}
                  {myId !== userId &&
                    !emailVerified && (
                      <div style={{ color: Color.gray(), fontSize: '1.2rem' }}>
                        {`This user's email has not been verified, yet`}
                      </div>
                    )}
                </>
              )}
              {youtubeUrl && (
                <div
                  style={{
                    marginTop: '0.5rem'
                  }}
                >
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
                </div>
              )}
              {website && (
                <div style={{ marginTop: '0.5rem' }}>
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

  goToEmail = () => {
    const { email } = this.props;
    const emailProvider = 'http://www.' + email.split('@')[1];
    window.location = emailProvider;
  };

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
    if (this.mounted) {
      this.setState({ onEdit: false });
    }
  };

  onVerifyEmail = () => {
    const { dispatch } = this.props;
    sendVerificationEmail({ dispatch });
    this.setState({
      emailCheckHighlighted: false,
      verificationEmailSent: true
    });
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
